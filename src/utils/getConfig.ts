import {join} from "path";
import {dynamicImport} from "./dynamic-import";

export interface obsConfig {
  OBS_AK: string,
  OBS_SK: string,
  BUCKET_NAME: string,
  OBJECT_NAME: string,
  OBJECT_FONT_NAME: string,
  IMG_PATH: string,
  BAK_PATH: string,
  FILES_PATH: string,
  FILES_FOLDER:string,
  FONT_PATH: string,
  IGNORE_FILES: Array<string>,
  ICONFONT_IGNORE_FILES: Array<string>,
  TEMPLATE_FONT_FACE: string
}

export const getConfig = async():Promise<obsConfig>=>{
  return await dynamicImport(join(process.cwd(), 'obs-config.js'))
}
