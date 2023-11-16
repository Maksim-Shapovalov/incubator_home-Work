import {Request, Response, Router} from "express";
import {securityDevicesRepo} from "../../repository/security-devices-repo";
import {ValidationRefreshToken} from "../../middleware/token-middleware";
import {OutpatModeldevicesUser} from "../../types/device-of-user";
import {de} from "date-fns/locale";
import {HTTP_STATUS} from "../../index";
import {securityDeviceService} from "../../service-rep/security-device-service";

export const securityDevices = Router();

securityDevices.get("/", ValidationRefreshToken,
    async (req:Request, res:Response) =>{
    const user = req.body.user
    const devices: OutpatModeldevicesUser|null = await securityDeviceService.getAllDevices(user.id)
        if (!devices){
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        res.status(HTTP_STATUS.OK_200).send(devices)
})