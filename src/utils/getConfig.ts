import {join} from "path";
// import {dynamicImport} from "./dynamic-import";

export interface obsConfig {
  OBS_AK: string,
  OBS_SK: string,
  BUCKET_NAME: string,
  OBJECT_NAME: string,

  IMAGES_OBS_FOLDER:string,
  IMAGES_PATH: string,
  IMAGES_BACKUP_PATH: string,
  IMAGES_IGNORE: Array<string>,

  FILES_PATH: string,
  FILES_OBS_FOLDER:string,
  FILES_IGNORE: Array<string>,

  ICONFONT_OBS_FOLDER: string,
  ICONFONT_FILE_PATH: string,
  ICONFONT_IGNORE: Array<string>,
  TEMPLATE_FONT_FACE: string
}

export const getConfig = async():Promise<obsConfig>=>{
  return require(join(process.cwd(), 'obs-config.js'))
  // return await dynamicImport(join(process.cwd(), 'obs-config.js'))
}
