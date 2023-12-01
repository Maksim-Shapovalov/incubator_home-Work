import {Request, Response, Router} from "express";
import {serviceUser} from "../../service-rep/service-user";
import {HTTP_STATUS} from "../../index";
import {jwtService} from "../../application/jwt-service";
import {userMapper, userRepository, UserToCodeMapper} from "../../repository/user-repository";
import {authMiddleware, CheckingAuthorizationValidationCode} from "../../middleware/auth-middleware";
import {authService} from "../../domain/auth-service";
import {AuthValidation, AuthValidationEmail} from "../../middleware/input-middleware/validation/auth-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {ValidationRefreshToken} from "../../middleware/token-middleware";

import {deletedTokenRepoRepository} from "../../repository/deletedTokenRepo-repository";



export const authRouter = Router()


authRouter.post("/login", async (req: Request ,res:Response)=>{
    const userAgent = {
        IP: req.socket.remoteAddress || req.headers['x-forwarded-for'],
        deviceName: req.headers["user-agent"]
    }
    const user = await serviceUser.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user){
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        return
    }
    const token = await jwtService.createdJWTAndInsertDevice(userMapper(user), userAgent)

    res.cookie('refreshToken', token[1], {httpOnly: true,secure: true})
   return res.status(HTTP_STATUS.OK_200).send({accessToken:token[0]})
})
authRouter.post("/refresh-token", ValidationRefreshToken ,async (req: Request ,res:Response) => {
    const deviceId = req.body.deviceId
    const refreshToken = req.cookies.refreshToken

    const user = req.body.user;

    const token = await jwtService.createdJWT(userMapper(user))
    // const newDateDevice = await securityDeviceService.updateDevice(deviceId)
    // if (!newDateDevice) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)

    await deletedTokenRepoRepository.deletedTokens(refreshToken)

    res.cookie('refreshToken', token[1], {httpOnly: true,secure: true})

    return res.status(HTTP_STATUS.OK_200).send({accessToken:token[0]})
})
authRouter.post("/logout",ValidationRefreshToken,async (req: Request ,res:Response) => {
    await deletedTokenRepoRepository.deletedTokens(req.cookies.refreshToken)
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)

})

authRouter.post("/registration-confirmation",
    CheckingAuthorizationValidationCode(),
    ErrorMiddleware,
    async (req: Request ,res:Response) => {

    const result = await authService.confirmatorUser(req.body.code)
        if (!result){
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})
authRouter.post("/registration",
    AuthValidation(),
    ErrorMiddleware,
    async (req: Request ,res:Response) => {
    const user = await serviceUser.getNewUserToRegistr(req.body.login,req.body.password, req.body.email)
        console.log('registr',user)
        await authService.doOperation(user)
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})
authRouter.post("/registration-email-resending",
    AuthValidationEmail(),
    ErrorMiddleware,
    async (req: Request ,res:Response) => {
    const findUser =  await userRepository.findByLoginOrEmail(req.body.email)
        if (!findUser) {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
            return
        }
        console.log( 'resending user',findUser)
        await authService.findUserByEmail(findUser)
   return res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        //ToDo: create service to router
})
authRouter.get("/me",
    authMiddleware ,
    async (req: Request ,res:Response)=> {
    const user = req.body.user

    if (!user){
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        return
    }
    res.status(HTTP_STATUS.OK_200).send({
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    })
})