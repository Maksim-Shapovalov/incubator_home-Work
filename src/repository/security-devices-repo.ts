import {dataID} from "../DB/data-base";
import {DevicesUserDB} from "../types/device-of-user";


export const securityDevicesRepo = {

    async getAllDevices(userId:string): Promise<DevicesUserDB | null>{
        const device = await dataID.findOne({userId:  userId})
        if (!device){
            return null
        }
        return device
    },
    async deletingAllDevicesExceptId(user:any ,deviceId:string){
        const deleted = await dataID.deleteMany({userId: user.id ,deviceId: {$ne:deviceId}})
        return deleted.deletedCount === 1
    },
    async deletingAllDevices(user:any){
        const deleted = await dataID.deleteMany({userId: user.id})
        return deleted.deletedCount === 1
    }
}