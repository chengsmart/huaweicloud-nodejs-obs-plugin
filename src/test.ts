import {getObsClient} from "./utils/obs";
import {getConfig} from "./utils/getConfig";

export const test = async()=> {
    const config = await getConfig();
    const obsClient = await getObsClient();
    console.log('config',JSON.stringify(config))
    console.log('obsClient',JSON.stringify(obsClient))
};
test()
