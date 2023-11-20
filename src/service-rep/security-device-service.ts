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