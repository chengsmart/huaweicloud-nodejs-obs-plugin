import fs from 'fs'
import chalk from 'chalk';
import admZip from 'adm-zip';
import iconv from 'iconv-lite';
import {uploadFile} from './utils/upload';
import {getConfig} from "./utils/getConfig";

const TEMP_PATH = './.obs-upload-temp/';

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question(`请输入iconfont解压后的文件夹绝对路径?`, url => {
    const zipPath = url?.trim()
    const tempPath = unzip(zipPath, TEMP_PATH)
    changeFileUrl(TEMP_PATH + tempPath);
    readline.close();
});

/**
 * unzip
 *   zipFile，待解压缩的zip文件
 *   destFolder，解压缩后存放的文件夹
 */
const unzip = (zipFile, destFolder) => {
    let decompressionPathName = '';
    const zip = new admZip(zipFile);
    const zipEntries = zip.getEntries();
    for (let i = 0; i < zipEntries.length; i++) {
        const entry = zipEntries[i];
        entry.entryName = iconv?.decode?.(entry.rawEntryName, 'gbk');
        if (i === 0) {
            decompressionPathName = entry.entryName;// 记录文件名
        }
    }
    zip.extractAllTo(destFolder, true);
    return decompressionPathName
}
const changeFileUrl = async (dirPath: string) => {
    const config = await getConfig();
    const fontPath = process.cwd() + config.ICONFONT_FILE_PATH;
    const newFile = dirPath + 'iconfont.css';
    fs.readFile(newFile, 'utf8', (_, dataStr) => {

        if (!dataStr) {
            return;
        }
        let str = dataStr
        if (!!config?.TEMPLATE_FONT_FACE) {
            str = dataStr.replace(/\@font-face\s?\{[\s\S]*?\}/g, config.TEMPLATE_FONT_FACE);
        }
        fs.writeFile(newFile, str, (error) => {
            if (error) throw error;
            fs.copyFile(newFile, fontPath, (errorInfo) => {
                if (errorInfo) throw errorInfo;
                uploadSource(dirPath);
            });
        });
    });
};
const uploadSource = async (dirPath) => {
    const config = await getConfig();
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.log(chalk.red('读取文件失败'));
            return;
        }
        const total = files.length;
        let hasDoneNum = 0;
        files.forEach((filename) => {
            // 实际小程序项目只使用到了ttf文件
            if (config?.ICONFONT_IGNORE?.includes(filename)) {
                hasDoneNum++;
                if (hasDoneNum >= total) {
                    removeTempDir()
                }
                return;
            }
            // ! 需要检测是否存在文件夹，目前因为下载文件不存在文件夹的情况，所以暂无该逻辑
            const targetPath = config.OBJECT_NAME + config.ICONFONT_OBS_FOLDER + filename;
            const sourcePath = dirPath + filename;
            uploadFile(targetPath, sourcePath, () => {
                console.log(chalk.green(`${filename} 上传成功`));
            }, () => {
            }, () => {
                hasDoneNum++
                if (hasDoneNum >= total) {
                    removeTempDir()
                }
            });
        });
    });
};
const removeTempDir = () => {
    fs.rmdirSync(TEMP_PATH, {recursive: true})
    console.log(chalk.black.bgGreen('操作完成'));
}
