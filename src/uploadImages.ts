import fs from 'fs';
import os from 'os';
import path from 'path';
import chalk from 'chalk';
import slash from 'slash';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import {uploadFile} from './utils/upload';
import {moveFile} from './utils/moveFile';
import {getConfig} from "./utils/getConfig";
// 不限制监听数量
require('events').EventEmitter.defaultMaxListeners = 0;

const andPath = (os.type() == "Windows_NT") ? '\\' : '/';


let filesTotalNum = 0; // 总文件数量
let filesDoneNum = 0; // 已经上传的数量
let filesIgnoreNum = 0; // 已经忽略的数量

let progressisStart = false;

const uploadProgress = new cliProgress.SingleBar({
    format: '上传进度 |' + colors.green('{bar}') + '| {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

// 遍历文件夹
const fileDisplay = async (_filePath?: string) => {
    const config = await getConfig();
    // 文件夹路径
    const imagesPath = path.resolve('.' + config.IMAGES_PATH);
    let filePath: string;
    if (typeof _filePath === 'undefined') {
        filePath = imagesPath;
    } else {
        filePath = _filePath;
    }
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.log(chalk.red('读取文件失败'));
            return;
        }
        const filesLength = files?.length;
        if (filesLength === 0 && typeof _filePath === 'undefined') {
            // 从第一次遍历，文件夹下就没有可上传的资源
            console.log(chalk.yellow(`${filePath}下没有可上传的资源`));
            return;
        }
        // 遍历读取到的文件列表
        files.forEach((filename) => {
            // 获取当前文件的绝对路径
            const fileDir = path.join(filePath, filename);
            // 根据文件路径获取文件信息
            fs.stat(fileDir, (err, stats) => {
                if (err) {
                    console.log(chalk.red('获取文件信息失败'));
                    return;
                }
                const isFile = stats.isFile();
                // 是文件
                if (isFile) {

                    const relativePath = fileDir.replace(imagesPath + andPath, '');
                    // 忽略列表
                    if (config.IMAGES_IGNORE?.includes(relativePath)) {
                        console.log(chalk.gray('【忽略】该文件已存在于忽略列表，文件名' + relativePath));
                        if (filesDoneNum + filesIgnoreNum >= filesTotalNum && progressisStart) {
                            uploadProgress.stop();
                        }
                        return;
                    }

                    if (!progressisStart) {
                        // 未开始，则开始进度条
                        uploadProgress.start(1, filesDoneNum);
                    }

                    try {
                        const destPath = path.join(process.cwd(), config.IMAGES_BACKUP_PATH, relativePath);
                        fs.accessSync(destPath, fs.constants.F_OK);
                        console.log(chalk.yellow('【命名重复】该文件已存在或已上传，文件名' + relativePath));
                    } catch (err) {
                        filesTotalNum++;
                        uploadProgress.setTotal(filesTotalNum);
                        // 上传obs，上传完成后移动本地文件
                        const targetPath = config.OBJECT_NAME + config.IMAGES_OBS_FOLDER + relativePath; // demo 'upload-example/coupon-empty.png'
                        const sourcePath = path.join(imagesPath, relativePath);
                        uploadFile(slash(targetPath), sourcePath, () => moveFile(relativePath, filename), () => {
                        }, () => {
                            filesDoneNum++;
                            uploadProgress.update(filesDoneNum);
                            if (filesDoneNum + filesIgnoreNum >= filesTotalNum) {
                                uploadProgress.stop();
                            }
                        });
                    }
                    return;
                }
                const isDir = stats.isDirectory();
                // 是文件夹，继续递归
                isDir && fileDisplay(fileDir);
            });
        });
    });
};

fileDisplay();
