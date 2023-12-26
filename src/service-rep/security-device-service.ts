import {securityDevicesRepo} from "../repository/security-devices-repo";
import { OutpatModeldevicesUser} from "../types/device-of-user";
import {ObjectId} from "mongodb";


export class SecurityDeviceService {
    async getAllDevices(userId: string): Promise<OutpatModeldevicesUser[] | null> {
        const devices = await securityDevicesRepo.getAllDevices(new ObjectId(userId).toString())
        if (!devices) {
            return null
        }
        return devices
    }

    async deletingDevicesExceptId(userId: string, deviceId: string) {
        return securityDevicesRepo.deletingDevicesExceptId(userId, deviceId)

    }

    async deletingAllDevices(user: string, device: string) {
        return securityDevicesRepo.deletingAllDevices(user, device)

    }
}

export const securityDeviceService = new SecurityDeviceService()



