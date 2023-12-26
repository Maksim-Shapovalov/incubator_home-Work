import {Request, Response, Router} from "express";
import {serviceUser} from "../../service-rep/service-user";
import {HTTP_STATUS} from "../../index";
import {jwtService} from "../../application/jwt-service";
import {userMapper, userRepository} from "../../repository/user-repository";
import {authMiddleware, CheckingAuthorizationValidationCode} from "../../middleware/auth-middleware";
import {authService} from "../../domain/auth-service";
import {
    AuthBodyToSendNewPassword,
    AuthValidation,
    AuthValidationEmail,
    AuthValidationEmailToSendMessage
} from "../../middleware/input-middleware/validation/auth-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {IPRequestCounter, ValidationRefreshToken} from "../../middleware/token-middleware";
import {deletedTokenRepoRepository} from "../../repository/deletedTokenRepo-repository";
import {securityDeviceService} from "../../service-rep/security-device-service";


export const authRouter = Router()

class AuthController {
    async loginInApp(req: Request, res: Response) {
        const userAgent = {
            IP: req.socket.remoteAddress || req.headers['x-forwarded-for'],
            deviceName: req.headers["user-agent"]
        }
        const user = await serviceUser.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)

        const {accessToken, refreshToken} = await jwtService.createdJWTAndInsertDevice(userMapper(user), userAgent)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        return res.status(HTTP_STATUS.OK_200).send({accessToken})
    }

    async passwordRecovery(req: Request<{}, {}, { email: string }>, res: Response) {
        const requestEmail: string = req.body.email
        if (!requestEmail) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        await authService.sendEmailMessage(requestEmail)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async createdNewPasswordForUserby(req: Request, res: Response) {
        const requestEmail = {
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode,
            newSalt: ''
        }
        if (!requestEmail) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        const user = await authService.findUserByRecoveryCode(requestEmail)
        if (!user) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async refreshToken(req: Request, res: Response) {
        const oldRefreshToken = req.cookies.refreshToken
        const user = req.body.user;

        const token = await jwtService.updateJWT(userMapper(user), oldRefreshToken)//update

        if (!token) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

        const {accessToken, refreshToken} = token

        await deletedTokenRepoRepository.deletedTokens(oldRefreshToken)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        return res.status(HTTP_STATUS.OK_200).send({accessToken})
    }

    async logoutInApp(req: Request, res: Response) {

        const user = req.body.user
        const device = req.body.deviceId
        const token = req.cookies.refreshToken

        const deletedDevice = await securityDeviceService.deletingDevicesExceptId(user._id.toString(), device.deviceId)
        const bannedToken = await deletedTokenRepoRepository.deletedTokens(token)

        if (!bannedToken) {
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        }
        if (!deletedDevice) {
            return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async registrationConfirmation(req: Request, res: Response) {

        const result = await authService.confirmatoryUser(req.body.code)
        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async registrationInApp(req: Request, res: Response) {
        const user = {
            login: req.body.login,
            password: req.body.password,
            email: req.body.email
        }
        // const createUser: UserToShow = await serviceUser.getNewUser(user)
        await authService.doOperation(user)
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async registrationEmailResending(req: Request, res: Response) {
        const findUser = await userRepository.findByLoginOrEmail(req.body.email)
        if (!findUser) return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
        await authService.findUserByEmail(findUser)
        return res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async me(req: Request, res: Response) {
        const user = req.body.user

        if (!user) return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)

        res.status(HTTP_STATUS.OK_200).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        })
    }
}

const authController = new AuthController()

authRouter.post("/login", IPRequestCounter, authController.loginInApp)

authRouter.post("/password-recovery",
    AuthValidationEmailToSendMessage(), IPRequestCounter,
    ErrorMiddleware, authController.passwordRecovery)

authRouter.post("/new-password", AuthBodyToSendNewPassword(),
    IPRequestCounter, ErrorMiddleware, authController.createdNewPasswordForUserby)

authRouter.post("/refresh-token",
    ValidationRefreshToken, IPRequestCounter, authController.refreshToken)

authRouter.post("/logout",
    ValidationRefreshToken, authController.logoutInApp)

authRouter.post("/registration-confirmation",
    IPRequestCounter, CheckingAuthorizationValidationCode(),
    ErrorMiddleware, authController.registrationConfirmation)

authRouter.post("/registration",
    IPRequestCounter, AuthValidation(), ErrorMiddleware, authController.registrationConfirmation)

authRouter.post("/registration-email-resending",
    IPRequestCounter, AuthValidationEmail(),
    ErrorMiddleware, authController.registrationEmailResending)

authRouter.get("/me",
    authMiddleware, authController.me)