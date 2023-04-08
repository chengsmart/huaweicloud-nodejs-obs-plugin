import fs from 'fs'
import path from 'path'
import chalk  from 'chalk';
import {getConfig} from "./getConfig";
const projectPath = process.cwd();
// 不限制监听数量
require('events').EventEmitter.defaultMaxListeners = 0;

// 移动文件
const move = (sourceFile, destPath) => {
  fs.rename(sourceFile, destPath, function (err) {
    if (err) throw err;
  });
};
export const moveFile = async (filePath, filename) => {
  const config = await getConfig();
  const sourceFile = path.join(projectPath, config.IMG_PATH, filePath);
  const destPath = path.join(projectPath, config.BAK_PATH, filePath);
  // 目标文件夹不存在同名文件，可以移动，已经在上传前判断完了
  const targetPath = destPath.replace(filename, '');
  fs.stat(targetPath, (_, stats) => {
    // 检测是否存在目录，不存在则创建目录
    if (!stats) {
      fs.mkdir(targetPath, { recursive: true }, err => {
        if (err) {
          console.log(chalk?.red?.('创建文件夹失败'));
          throw err;
        }
        move(sourceFile, destPath);
      });
    } else {
      move(sourceFile, destPath);
    }
  });
};
