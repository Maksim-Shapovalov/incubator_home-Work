import {Request, Response, Router} from "express";
import {ValidationRefreshToken} from "../../middleware/token-middleware";
import {OutpatModeldevicesUser} from "../../types/device-of-user";
import {HTTP_STATUS} from "../../index";
import {SecurityDeviceService} from "../../service-rep/security-device-service";
import {SecurityDevicesRepo} from "../../repository/security-devices-repo";



export const securityDevices = Router();

class DeviceController {
    private securityDeviceService: SecurityDeviceService;
    private securityDevicesRepo: SecurityDevicesRepo;
    constructor() {
        this.securityDeviceService = new SecurityDeviceService()
        this.securityDevicesRepo = new SecurityDevicesRepo()
    }
    async getAllDevice(req: Request, res: Response) {

        const user = req.body.user
        const devices: OutpatModeldevicesUser[] | null = await this.securityDeviceService.getAllDevices(user._id)
        if (!devices) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        res.status(HTTP_STATUS.OK_200).send(devices)
    }

    async deleteDeviceUserById(req: Request, res: Response) {
        const user = req.body.user
        const findDevice: any = await this.securityDevicesRepo.getDevice(req.params.idDevice, user._id)


        if (!findDevice) {

            return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        if (findDevice === 5) {

            return res.sendStatus(HTTP_STATUS.Forbidden_403)
        }

        const deletedDevice = await this.securityDeviceService.deletingDevicesExceptId(user._id.toString(), req.params.idDevice)
        if (!deletedDevice) {
            return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)

    }

    async deleteAllDeviceUserExceptCurrent(req: Request, res: Response) {
        const user = req.body.user
        const device = req.body.deviceId
        console.log(device)
        await this.securityDeviceService.deletingAllDevices(user._id.toString(), device.deviceId)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }
}
const deviceControllerInstance = new DeviceController()
securityDevices.get("/",ValidationRefreshToken, deviceControllerInstance.getAllDevice.bind(deviceControllerInstance))
securityDevices.delete("/:idDevice", ValidationRefreshToken, deviceControllerInstance.deleteDeviceUserById.bind(deviceControllerInstance) )
securityDevices.delete("/",ValidationRefreshToken,  deviceControllerInstance.deleteAllDeviceUserExceptCurrent.bind(deviceControllerInstance))