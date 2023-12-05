import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../index";
import {jwtService} from "../application/jwt-service";
import {userRepository} from "../repository/user-repository";
import {ObjectId} from "mongodb";
import {deletedTokenRepoRepository} from "../repository/deletedTokenRepo-repository";
import {securityDevicesRepo} from "../repository/security-devices-repo";

export const ValidationRefreshToken = async (req: Request, res: Response , next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const findRefreshToken = await deletedTokenRepoRepository.findRefreshTokenInDB(refreshToken)

    if (!refreshToken){
        res.status(HTTP_STATUS.UNAUTHORIZED_401).send('no refresh token')
        return
    }
    if (findRefreshToken){

        res.status(HTTP_STATUS.UNAUTHORIZED_401).send('guzno')
        return
    }

    const payload = await jwtService.parseJWTRefreshToken(refreshToken);

    if (payload){
        const userId = new ObjectId(payload.userId) ;
        const user = await userRepository.getUserById(userId)


        if(!user){
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
            return
        }

        req.body.user = user
        req.body.deviceId = payload


        next()
        return;
    }else{

        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    }
}
export const FindDeviceInDBToRefreshToken = async (req: Request, res: Response , next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const payload = await jwtService.parseJWTRefreshToken(refreshToken);
    if (payload){
        const userId = new ObjectId(payload.userId) ;
        const user = await userRepository.getUserById(userId)
        if(!user){
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
            return
        }
        const device = await securityDevicesRepo.getDevice(payload.deviceId,user._id.toString())
        if(!device || device === 5){
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
            return
        }
        next()
        return;
    }else{

        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    }
}

// export const ValidationAccessToken = async (req: Request, res: Response , next: NextFunction) => {
//     const accessToken = req.body.accessToken
//     console.log(accessToken,'access')
//
//     if (!accessToken){
//         res.status(HTTP_STATUS.UNAUTHORIZED_401).send('no access token')
//         return
//     }
//
//     const payload = await jwtService.parseJWTAccessToken(accessToken);
//     console.log(payload)
//     if (payload){
//         const userId = new ObjectId(payload.userId) ;
//         const user = await userRepository.getUserById(userId)
//
//         if(!user){
//             console.log("no user")
//             res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
//             return
//         }
//
//         req.body.user = user
//
//         next()
//         return;
//     }else{
//         return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
//     }
// }