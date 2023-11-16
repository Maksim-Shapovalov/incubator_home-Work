import {dataID} from "../DB/data-base";
import {DevicesUserDB} from "../types/device-of-user";


export const securityDevicesRepo = {

    async getAllDevices(userId:string): Promise<DevicesUserDB | null>{
        const device = await dataID.findOne({userId:  userId})
        if (!device){
            return null
        }
        return device
    }
}