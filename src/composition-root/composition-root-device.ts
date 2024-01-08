import {SecurityDevicesRepo} from "../repository/security-devices-repo";
import {SecurityDeviceService} from "../service-rep/security-device-service";
import {DeviceController} from "../routers/security-deviced/security-devices";

const securityDeviceRepository = new SecurityDevicesRepo()
const securityDeviceService = new SecurityDeviceService(securityDeviceRepository)

export const deviceController = new DeviceController(securityDeviceService,securityDeviceRepository)