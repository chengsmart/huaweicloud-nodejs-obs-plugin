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
   3. `uploadFiles` 上传文件夹下的所有文件夹，覆盖上传，不会移动目标文件


## 配置文档

```javascript
// obs-config.js
module.exports = {
  OBS_AK: '', // OBS Access Key ID
  OBS_SK: '', // OBS Secret Access Key
  BUCKET_NAME: 'myStore', // 桶名称
  OBJECT_NAME: 'wesite/demo/', // OBS对象的前置文件夹，一般指项目目录
  // uploadImages 相关
  IMAGES_OBS_FOLDER: 'images/', // 远程项目目录的images资源文件夹
  IMAGES_PATH: '/src/static/images', // 本地原有资源目录
  IMAGES_BACKUP_PATH: '/bak.images', // 本地备份资源目录
  IMAGES_IGNORE: ['.DS_Store'], // 忽略上传名单
  // uploadFiles
  FILES_OBS_FOLDER: 'static/', // 远程项目目录的资源文件夹
  FILES_PATH: '/src/static/files_folder', // 本地原有资源目录
  FILES_IGNORE: [], // 忽略上传名单
  // uploadFont
  ICONFONT_OBS_FOLDER: 'iconfont/', // 远程项目目录的iconfont文件夹
  ICONFONT_FILE_PATH: '/src/styles/iconfont.css', // 本地iconfont.css文件位置，用于更新font-face
  ICONFONT_IGNORE: ['demo_index.html', 'demo.css'], // iconfont 上传忽略名单
  // 要替换的font-face的内容
  TEMPLATE_FONT_FACE: 
          '@font-face {\n' +
          '  font-family: "iconfont";\n' +
          '  src: url(\'https://your.obs-cdn.com/wesite/demo/iconfont/iconfont.woff2\') format(\'woff2\'),\n' +
          '    url(\'https://your.obs-cdn.com/wesite/demo/iconfont/iconfont.woff\') format(\'woff\'),\n' +
          '    url(\'https://your.obs-cdn.com/wesite/demo/iconfont/iconfont.ttf\') format(\'truetype\'),\n' +
          '    url(\'https://your.obs-cdn.com/wesite/demo/iconfont/iconfont.svg\') format(\'svg\');\n' +
          '}',

};

```

## Tips

1. 上传前需要注意`桶`是否真实存在于obs中，否则会报错
2. iconfont默认是[iconfont](https://www.iconfont.cn/)，上传路径是下载的压缩包绝对路径

## 使用效果

### 上传图片

![image-20230301114315359](https://p.ipic.vip/ar1ikg.png)

### 上传文件

![WX20230408-113728](https://p.ipic.vip/zwbkx7.png)

### 上传iconfont

![WechatIMG93](https://p.ipic.vip/4rkfu3.png)
