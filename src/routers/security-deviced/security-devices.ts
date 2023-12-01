import {Request, Response, Router} from "express";
import {ValidationRefreshToken} from "../../middleware/token-middleware";
import {OutpatModeldevicesUser} from "../../types/device-of-user";
import {HTTP_STATUS} from "../../index";
import {securityDeviceService} from "../../service-rep/security-device-service";
import {securityDevicesRepo} from "../../repository/security-devices-repo";

export const securityDevices = Router();

securityDevices.get("/",ValidationRefreshToken,
    async (req:Request, res:Response) =>{

    const user = req.body.user
    const devices: OutpatModeldevicesUser[] | null = await securityDeviceService.getAllDevices(user._id)
        if (!devices){
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        res.status(HTTP_STATUS.OK_200).send(devices)
})
securityDevices.delete("/:idDevice", ValidationRefreshToken,async (req:Request, res:Response) => {

    const user = req.body.user
    const findDevice = await securityDevicesRepo.getDevice(req.params.idDevice)
    if (!findDevice){
        return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
    }
    if (findDevice?.userId !== user._id){
        return res.sendStatus(HTTP_STATUS.Forbidden_403)
    }
    const deletedDevice = await securityDeviceService.deletingAllDevicesExceptId(user,req.params.idDevice)
    if (!deletedDevice){
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)

})

securityDevices.delete("/",ValidationRefreshToken,async (req:Request, res:Response) => {
    const user = req.body.user
    const device = req.body.deviceId
    const deletedDevice = await securityDeviceService.deletingAllDevices(user,device)
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})