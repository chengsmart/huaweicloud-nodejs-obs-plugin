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
3. 在项目根目录执行
   1. `uploadImages` 用于上传小程序图片资源，会检测备份目录是否存在相同文件，然后自动移动目标文件夹的图片到备份目录
   2. `uploadFont` 自动解压zip压缩包并上传字体资源
   3. `uploadFiles` 上传文件夹下的所有文件夹，不会检测存在重复，不会移动目标文件


## 配置文档

```javascript
// obs-config.js
module.exports = {
  OBS_AK: '', // OBS Access Key ID
  OBS_SK: '', // OBS Secret Access Key
  BUCKET_NAME: 'myStore', // 桶名称
  OBJECT_NAME: 'wesite/demo/', // OBS对象的前置文件夹
  OBJECT_FONT_NAME: '', // iconfont 上传到obs的路径
  IMG_PATH: '/src/static/images', // 项目中要上传的资源目录
  BAK_PATH: '/bak.images', // 上传后的备份资源目录
  FILES_PATH: '/src/static/files_folder', // 原有资源目录
  FILES_FOLDER: 'www/', // 上传文件到obs的文件夹
  FONT_PATH: '/src/styles/iconfont.css', // iconfont 样式文件更新位置
  IGNORE_FILES: ['.DS_Store'], // 忽略上传名单
  ICONFONT_IGNORE_FILES: [], // iconfont文件夹下的上传忽略名单
  TEMPLATE_FONT_FACE: '', // 要替换的font-face的内容
};

```

## Tips

1. 上传前需要注意`桶`是否真实存在于obs中，否则会报错
2. iconfont默认是[iconfont](https://www.iconfont.cn/)，上传路径是下载的压缩包绝对路径

## 使用效果

![image-20230301114315359](https://p.ipic.vip/ar1ikg.png)

