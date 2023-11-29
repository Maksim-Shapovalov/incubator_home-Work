import {dataID} from "../DB/data-base";
import {DevicesUserDB, OutpatModeldevicesUser} from "../types/device-of-user";
import {WithId} from "mongodb";
import {de} from "date-fns/locale";


export const securityDevicesRepo = {

    async getAllDevices(userId:string): Promise<OutpatModeldevicesUser[] | null>{
        const devices = await dataID.find({userId:  userId}).toArray()
        if (!devices){
            return null
        }
        return devices.map(deviceMapper)
    },
    async deletingAllDevicesExceptId(user:any ,deviceId:string){
        const deleted = await dataID.deleteOne({userId: user.id ,deviceId: deviceId})
        return deleted.deletedCount === 1
    },
    async deletingAllDevices(user:any,device:any){
        const deleted = await dataID.deleteMany({userId: user.id, deviceId: {$ne: device}})
        return deleted.deletedCount === 1
    }
}
const deviceMapper = (device: WithId<DevicesUserDB>): OutpatModeldevicesUser => {
    return {
        ip: device.ip,
        title: device.title,
        deviceId: device.deviceId,
        lastActiveDate: device.lastActiveDate
    }
}