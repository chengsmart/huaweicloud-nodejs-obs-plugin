const fs = require('fs');
const chalk = require('chalk');
const path = require("path");
const uploadFile = require('./upload');
const configPath = path.resolve('./obs-config.js' );
const config = require(configPath);
const fontPath = process.cwd() + '/src/styles/iconfont.css';

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(`请输入iconfont解压后的文件夹绝对路径?`, url => {
  changeFileUrl(url?.trim());
  readline.close();
});
const changeFileUrl = (dirPath) => {
  const newFile = dirPath + '/iconfont.css';
  fs.readFile(newFile, 'utf8', (err, datastr) => {
    if (!datastr) { return; }
    let str = datastr
    if(!!config?.TEMPLATE_FONT_FACE){
      str = datastr.replace(/\@font-face\s?\{[\s\S]*?\}/g, config.TEMPLATE_FONT_FACE);
    }
    fs.writeFile(newFile, str, (err, datastr) => {
      if (err) throw err;

      fs.copyFile(newFile, fontPath, function (err) {
        if (err) throw err;
        uploadSource(dirPath);
      });
    });
  });
};
const uploadSource = (dirPath) => {
  fs.readdir(dirPath+'/', (err, files) => {
    if (err) {
      console.log(chalk.red('读取文件失败'));
      return;
    }
    files.forEach((filename) => {
      // 实际小程序项目只使用到了ttf文件
      if (config?.ICONFONT_IGNORE_FILES?.includes(filename)) { return; }
      // TODO 需要检测是否存在文件夹，目前因为下载文件不存在文件夹的情况，所以暂无该逻辑
      const targetPath = config.OBJECT_NAME + config.OBJECT_FONT_NAME + filename;
      const sourcePath = dirPath + '/' + filename;
      uploadFile(targetPath, sourcePath,()=>{
        console.log(chalk.green(`${filename} 上传成功`));
      });
    });
  });
};
