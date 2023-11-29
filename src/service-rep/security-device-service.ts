import {securityDevicesRepo} from "../repository/security-devices-repo";
import {DevicesUserDB, OutpatModeldevicesUser} from "../types/device-of-user";
import {ObjectId, WithId} from "mongodb";


export const securityDeviceService={
    async getAllDevices(userId:string): Promise<OutpatModeldevicesUser | null>{
        const devices = await securityDevicesRepo.getAllDevices(new ObjectId(userId).toString())
        if (!devices){
            return null
        }
        return devices
    },
    async deletingAllDevicesExceptId(user: any,deviceId: string){
        const deletedDevice = await securityDevicesRepo.deletingAllDevicesExceptId(user,deviceId)
        return deletedDevice
    },
    async deletingAllDevices(user: any,device:any){
        const deletedDevice = await securityDevicesRepo.deletingAllDevices(user,device)
        return deletedDevice
    }
}


// export const deviceMapper =(device: WithId<PostsType>) => {
//
//     return {
//         title: device.title,
//         shortDescription: device.shortDescription,
//         content: device.content,
//         blogId: device.blogId,
//         blogName: device.blogName,
//         createdAt: device.createdAt
//     }

