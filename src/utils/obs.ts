import ObsClient from 'esdk-obs-nodejs';
import {getConfig} from "./getConfig";

type obsClientType = any;
// 创建ObsClient实例
let obsClient: obsClientType = undefined;

export const getObsClient = async (): Promise<obsClientType> => {
    const {OBS_AK, OBS_SK} = await getConfig()
    return Promise.resolve().then(async ()=>{
        if (!obsClient) {
            obsClient = new ObsClient({
                access_key_id: OBS_AK,
                secret_access_key: OBS_SK,
                server: 'https://obs.cn-north-4.myhuaweicloud.com'
            });
        }
        return obsClient
    })
}

