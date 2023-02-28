const fs = require('fs');
const chalk = require('chalk');
const path = require("path");
const uploadFile = require('./upload');
const configPath = path.resolve('./obs-config.js' );
const config = require(configPath);
const fontPath = process.cwd() + '/src/styles/iconfont.css';

const fontface = '@font-face {\n' +
  '  font-family: "iconfont";\n' +
  '  src: url(\'https://cdn-product-prod.yummy.tech/wechat/cotti/iconfont/iconfont.woff2\') format(\'woff2\'),\n' +
  '    url(\'https://cdn-product-prod.yummy.tech/wechat/cotti/iconfont/iconfont.woff\') format(\'woff\'),\n' +
  '    url(\'https://cdn-product-prod.yummy.tech/wechat/cotti/iconfont/iconfont.ttf\') format(\'truetype\'),\n' +
  '    url(\'https://cdn-product-prod.yummy.tech/wechat/cotti/iconfont/iconfont.svg\') format(\'svg\');\n' +
  '}';

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question(`请输入iconfont解压后的文件夹绝对路径?`, url => {
  changeFileUrl(url);
  readline.close();
});
const changeFileUrl = (dirPath) => {
  const newFile = dirPath + '/iconfont.css';
  fs.readFile(newFile, 'utf8', (err, datastr) => {
    if (!datastr) { return; }
    const str = datastr.replace(/\@font-face\s?\{[\s\S]*?\}/g, fontface);
    fs.writeFile(newFile, str, (err, datastr) => {
      if (err) throw err;

      fs.copyFile(newFile, fontPath, function (err) {
        if (err) throw err;
        uploadSource(dirPath);
      });
    });
  });
};
const blackList = ['demo_index.html', 'demo.css']; // demo相关文件不上传到obs
const uploadSource = (dirPath) => {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.log(chalk.red('读取文件失败'));
      return;
    }
    files.forEach((filename) => {
      // 实际小程序项目只使用到了ttf文件
      if (blackList.includes(filename)) { return; }
      // TODO 需要检测是否存在文件夹，目前因为下载文件不存在文件夹的情况，所以暂无该逻辑
      const targetPath = config.OBJECT_NAME + 'iconfont/' + filename;
      const sourcePath = dirPath + '/' + filename;
      uploadFile(targetPath, sourcePath);
    });
  });
};
