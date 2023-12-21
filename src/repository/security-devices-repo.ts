import {DevicesUserDB, OutpatModeldevicesUser} from "../types/device-of-user";
import { WithId} from "mongodb";
import {DataIDModelClass} from "../schemas/dataID-schemas";



export const securityDevicesRepo = {


    async getDevice(sessionId:string, id:string){
        const device = await DataIDModelClass.findOne({deviceId: sessionId})

        if (!device ){
            return null
        }
        if (device?.userId  !== id.toString()){
            return 5
        }
        return device
    },
    async updateDevice(deviceId: string){
        const device = await DataIDModelClass.findOneAndUpdate({deviceId: deviceId},
            {$set: {lastActiveDate: new Date().toISOString()}})
        return device
    },

    async getAllDevices(userId:string): Promise<OutpatModeldevicesUser[] | null>{
        const devices = await DataIDModelClass.find({userId:  userId}).lean()
        if (!devices){
            return null
        }
        return devices.map(deviceMapper)
    },
    async deletingDevicesExceptId(userId:string ,deviceId:string){
        console.log('userId-----------------', userId)
        const deleted = await DataIDModelClass.deleteOne({userId, deviceId})
        return deleted.deletedCount === 1
    },
    async deletingAllDevices(user:string,device:string){
        console.log('tresh-------',user,device)
        const deleted = await DataIDModelClass.deleteMany({userId: user, deviceId: {$ne: device}})
        return deleted.deletedCount > 1
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