# huaweicloud-nodejs-obs-plugin

本地批量上传华为云插件

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/huaweicloud-nodejs-obs-plugin.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/huaweicloud-nodejs-obs-plugin
[download-image]: https://img.shields.io/npm/dm/huaweicloud-nodejs-obs-plugin.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/huaweicloud-nodejs-obs-plugin

## 插件说明

该插件会自动上传指定目录的文件到obs指定位置，同时对已上传的文件进行删除，并备份到本地的指定目录。如有重名文件，则跳过，并在控制条给出*文件重复*的提示

## 使用说明

1. `npm i -D huaweicloud-nodejs-obs-plugin`
2. 在项目根目录添加配置文件`obs-config.js`
3. 在项目根目录执行`uploadImages`

## 配置文档

```javascript
// obs-config.js
module.exports = {
  OBS_AK: '', // OBS Access Key ID
  OBS_SK: '', // OBS Secret Access Key
  BUCKET_NAME: 'myStore', // 桶名称
  OBJECT_NAME: 'wesite/demo/', // OBS对象的前置文件夹
  IMG_PATH: '/src/static/images', // 项目中要上传的资源目录
  BAK_PATH: '/bak.images', // 上传后的备份资源目录
  IGNORE_FILES: ['.DS_Store'] // 忽略上传名单
};

```

