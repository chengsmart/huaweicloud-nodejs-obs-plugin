const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');
const uploadFile = require('./upload');
const moveFile = require('./move');
const configPath = path.resolve('./obs-config.js' );
const config = require(configPath);

// 文件夹路径
const imagesPath = path.resolve('.' + config.IMG_PATH);
let filesTotalNum = 0; // 总文件数量
let filesDoneNum = 0; // 已经上传的数量

const uploadProgress = new cliProgress.SingleBar({
  format: '上传进度 |' + colors.green('{bar}') + '| {value}/{total}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

// 遍历文件夹
const fileDisplay = (filePath) => {
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
          const relativePath = fileDir.replace(imagesPath + '/', '');
          if(config.IGNORE_FILES.includes(relativePath)){
            console.log(chalk.gray('【忽略】该文件已存在于忽略列表，文件名' + relativePath));
            return;
          }
          try {
            const destPath = path.join(process.cwd(), config.BAK_PATH, relativePath);
            fs.accessSync(destPath, fs.constants.F_OK);
            console.log(chalk.yellow('【命名重复】该文件已存在或已上传，文件名' + relativePath));
          } catch (err) {
            filesTotalNum++;
            uploadProgress.setTotal(filesTotalNum);
            // 上传obs，上传完成后移动本地文件
            const targetPath = config.OBJECT_NAME + 'images/' + relativePath; // demo 'upload-example/coupon-empty.png'
            const sourcePath = imagesPath + '/' + relativePath;
            uploadFile(targetPath, sourcePath, () => moveFile(relativePath, filename),()=>{},()=>{
              filesDoneNum++;
              uploadProgress.update(filesDoneNum)
              if(filesDoneNum>=filesTotalNum){
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

fileDisplay(imagesPath);
