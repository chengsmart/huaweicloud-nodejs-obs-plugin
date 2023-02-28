// 引入obs库
const ObsClient = require('esdk-obs-nodejs');
const path = require("path");
const configPath = path.resolve('./obs-config.js' );
const config = require(configPath);
const { OBS_AK, OBS_SK } = config

// 创建ObsClient实例
const obsClient = new ObsClient({
  access_key_id: OBS_AK,
  secret_access_key: OBS_SK,
  server: 'https://obs.cn-north-4.myhuaweicloud.com'
});

module.exports = obsClient;
