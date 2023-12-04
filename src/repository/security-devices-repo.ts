import {dataID} from "../DB/data-base";
import {DevicesUserDB, OutpatModeldevicesUser} from "../types/device-of-user";
import {ObjectId, WithId} from "mongodb";



export const securityDevicesRepo = {


    async getDevice(sessionId:string, id:string){
        const device = await dataID.findOne({deviceId: sessionId})
        console.log(id)
        console.log(device?.userId)
        if (!device ){
            return null
        }
        if (device?.userId  !== id.toString()){
            return 5
        }
        return device
    },
    async updateDevice(deviceId: string){
        const device = await dataID.findOneAndUpdate({deviceId: deviceId},
            {$set: {lastActiveDate: new Date().toISOString()}})
        return device
    },

    async getAllDevices(userId:string): Promise<OutpatModeldevicesUser[] | null>{
        const devices = await dataID.find({userId:  userId}).toArray()
        if (!devices){
            return null
        }
        return devices.map(deviceMapper)
    },
    async deletingDevicesExceptId(userId:string ,deviceId:string){
        console.log('userId-----------------', userId)
        const deleted = await dataID.deleteOne({userId, deviceId})
        return deleted.deletedCount === 1
    },
    async deletingAllDevices(user:string,device:string){
        console.log('tresh-------',user,device)
        const deleted = await dataID.deleteMany({userId: user, deviceId: {$ne: device}})
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