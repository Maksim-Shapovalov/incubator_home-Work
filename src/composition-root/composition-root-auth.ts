import {UserRepository} from "../repository/user-repository";
import {ServiceUser} from "../service-rep/service-user";
import {SecurityDevicesRepo} from "../repository/security-devices-repo";
import {SecurityDeviceService} from "../service-rep/security-device-service";
import {DeletedTokenRepoRepository} from "../repository/deletedTokenRepo-repository";
import {JwtService} from "../application/jwt-service";
import {AuthService} from "../domain/auth-service";
import {RefreshTokenRepo} from "../repository/refreshToken-repo";
import {AuthController} from "../routers/user&auth/auth-router";

const userRepository = new UserRepository()
const userService = new ServiceUser(userRepository)
const securityDeviceRepository = new SecurityDevicesRepo()
const securityDeviceService = new SecurityDeviceService(securityDeviceRepository)
const deletedTokenRepository = new DeletedTokenRepoRepository()
const refreshTokenRepository = new RefreshTokenRepo()
export const jwtService = new JwtService(refreshTokenRepository,securityDeviceRepository)
const authService = new AuthService(userRepository,userService)

export const authController = new AuthController(authService,userService,
    securityDeviceService,userRepository,deletedTokenRepository,jwtService)