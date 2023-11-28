import {securityDevicesRepo} from "../repository/security-devices-repo";
import {DevicesUserDB, OutpatModeldevicesUser} from "../types/device-of-user";
import {WithId} from "mongodb";
import {de} from "date-fns/locale";

export const securityDeviceService={
    async getAllDevices(userId:string): Promise<OutpatModeldevicesUser | null>{
        const devices = await securityDevicesRepo.getAllDevices(userId)
        if (!devices){
            return null
        }
        return devices
    },
    async deletingAllDevicesExceptId(user: any,deviceId: string){
        const deletedDevice = await securityDevicesRepo.deletingAllDevicesExceptId(user,deviceId)
        return deletedDevice
    },
    async deletingAllDevices(user: any){
        const deletedDevice = await securityDevicesRepo.deletingAllDevices(user)
        return deletedDevice
    }
}


// const deviceMapper = (device: WithId<DevicesUserDB>): OutpatModeldevicesUser => {
//     return {
//         ip: device.ip,
//         title: device.title,
//         deviceId: device.deviceId,
//         lastActivateDate: device.lastActivateDate
//     }
// }