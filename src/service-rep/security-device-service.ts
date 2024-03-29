import {SecurityDevicesRepo} from "../repository/security-devices-repo";
import { OutpatModeldevicesUser} from "../types/device-of-user";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import "reflect-metadata"

@injectable()
export class SecurityDeviceService {

    constructor(protected securityDevicesRepo: SecurityDevicesRepo) {}
    async getAllDevices(userId: string): Promise<OutpatModeldevicesUser[] | null> {
        const devices = await this.securityDevicesRepo.getAllDevices(new ObjectId(userId).toString())
        if (!devices) {
            return null
        }
        return devices
    }

    async deletingDevicesExceptId(userId: string, deviceId: string) {
        return this.securityDevicesRepo.deletingDevicesExceptId(userId, deviceId)

    }

    async deletingAllDevices(user: string, device: string) {
        return this.securityDevicesRepo.deletingAllDevices(user, device)

    }
}




