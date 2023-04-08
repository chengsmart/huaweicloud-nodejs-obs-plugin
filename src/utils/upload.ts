import chalk from "chalk";
import {getObsClient} from "./obs";
import {getConfig} from "./getConfig";

interface IObsUploadRes  {
    CommonMsg:{
        Status:number,
        Code:number|string,
        Message:number|string,
        HostId:number|string,
        RequestId:number|string,
    },
    InterfaceResult:any
}

/**
 * 上传图片到obs
 * @param targetPath obs存放路径
 * @param sourcePath 本地存放路径
 * @param onUploadSuccess 上传成功后执行的回调函数
 * @param onUploadFail 上传失败后执行的回调函数
 * @param onUploadCompleted 上传完成后执行的回调函数
 */
export const uploadFile = async (targetPath: string, sourcePath: string, onUploadSuccess: () => void, onUploadFail: () => void, onUploadCompleted: () => void) => {
    const config = await getConfig();
    const obsClient = await getObsClient();
    obsClient?.putObject({
        Bucket: config.BUCKET_NAME,
        Key: targetPath,
        SourceFile: sourcePath
    })
        .then((result:IObsUploadRes) => {
            if (result.CommonMsg.Status < 300) {
                if (result.InterfaceResult) {
                    onUploadSuccess && onUploadSuccess();
                }
            } else {
                console.log(chalk.red('Code-->' + result.CommonMsg.Code));
                console.log(chalk.red('Message-->' + result.CommonMsg.Message));
                console.log(chalk.red('HostId-->' + result.CommonMsg.HostId));
                console.log(chalk.red('RequestId-->' + result.CommonMsg.RequestId));
            }
        })
        .catch((err:any) => {
            onUploadFail&&onUploadFail()
            console.log(chalk.bgRed('Error-->' + err));
        })
        .finally(onUploadCompleted);
};
