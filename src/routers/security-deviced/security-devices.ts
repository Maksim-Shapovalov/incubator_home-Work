import {Router} from "express";
import {ValidationRefreshToken} from "../../middleware/token-middleware";
import {container} from "../../composition-root/composition-root";
import {DeviceController} from "../../contoller/securityDevice-controller";

export const securityDevices = Router();

const deviceController = container.resolve<DeviceController>(DeviceController)

securityDevices.get("/", ValidationRefreshToken, deviceController.getAllDevice.bind(deviceController))
securityDevices.delete("/:idDevice", ValidationRefreshToken, deviceController.deleteDeviceUserById.bind(deviceController))
securityDevices.delete("/", ValidationRefreshToken, deviceController.deleteAllDeviceUserExceptCurrent.bind(deviceController))