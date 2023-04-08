import fs from 'fs'
import path from 'path'
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import colors from 'ansi-colors';
import {uploadFile} from './utils/upload';
import {getConfig} from "./utils/getConfig";

let filesTotalNum = 0; // 总文件数量
let filesDoneNum = 0; // 已经上传的数量

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
    const filesPath = path.resolve('.' + config.FILES_PATH);
    let filePath: string;
    if (typeof _filePath === 'undefined') {
        filePath = filesPath
    } else {
        filePath = _filePath;
    }
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.log(chalk.red('读取文件失败'));
            return;
        }
        uploadProgress.start(1, filesDoneNum); // 默认从1个文件开始
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
                    const relativePath = fileDir.replace(filesPath + '/', '');
                    if (config.IGNORE_FILES.includes(relativePath)) {
                        console.log(chalk.gray('【忽略】该文件已存在于忽略列表，文件名' + relativePath));
                        return;
                    }
                    // 上传计数
                    filesTotalNum++;
                    uploadProgress.setTotal(filesTotalNum);
                    // 上传obs，上传完成后调整展示计数
                    const targetPath = config.OBJECT_NAME + config.FILES_FOLDER + relativePath; // demo 'upload-example/coupon-empty.png'
                    const sourcePath = filesPath + '/' + relativePath;
                    uploadFile(targetPath, sourcePath, () => {
                    }, () => {
                    }, () => {
                        filesDoneNum++;
                        uploadProgress.update(filesDoneNum)
                        if (filesDoneNum >= filesTotalNum) {
                            uploadProgress.stop();
                        }
                    });

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
