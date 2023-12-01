import {dataID} from "../DB/data-base";
import {DevicesUserDB, OutpatModeldevicesUser} from "../types/device-of-user";
import {ObjectId, WithId} from "mongodb";
import {refreshTokenRepo} from "./refreshToken-repo";
import {ifError} from "assert";


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
    async deletingDevicesExceptId(userId:any ,deviceId:string){
        const deleted = await dataID.deleteOne({userId: userId.toISOString() ,deviceId: deviceId})
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