import {Request, Response, Router} from "express";
import {ValidationRefreshToken} from "../../middleware/token-middleware";
import {OutpatModeldevicesUser} from "../../types/device-of-user";
import {HTTP_STATUS} from "../../index";
import {securityDeviceService} from "../../service-rep/security-device-service";
import {ErrorMiddleware} from "../../middleware/error-middleware";

export const securityDevices = Router();

securityDevices.get("/",ValidationRefreshToken,
    async (req:Request, res:Response) =>{
    const user = req.body.user
    const devices: OutpatModeldevicesUser|null = await securityDeviceService.getAllDevices(user.id)
        if (!devices){
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
        console.log(devices)
        res.status(HTTP_STATUS.OK_200).send(devices)
})