const path = require("path");
const obsClient = require('./obs');
const chalk = require('chalk');
const configPath = path.resolve('./obs-config.js' );
const config = require(configPath);

/**
 * 上传图片到obs
 * @param targetPath obs存放路径
 * @param sourcePath 本地存放路径
 * @param onUploadSuccess 上传成功后执行的回调函数
 */
const uploadFile = (targetPath, sourcePath, onUploadSuccess = () => {}) => {
  obsClient.putObject({
    Bucket: config.BUCKET_NAME,
    Key: targetPath,
    SourceFile: sourcePath
  })
    .then((result) => {
      if (result.CommonMsg.Status < 300) {
        if (result.InterfaceResult) {
          onUploadSuccess();
        }
      } else {
        console.log(chalk.red('Code-->' + result.CommonMsg.Code));
        console.log(chalk.red('Message-->' + result.CommonMsg.Message));
        console.log(chalk.red('HostId-->' + result.CommonMsg.HostId));
        console.log(chalk.red('RequestId-->' + result.CommonMsg.RequestId));
      }
    }).catch((err) => {
      console.log(chalk.bgRed('Error-->' + err));
    });
};
module.exports = uploadFile;
