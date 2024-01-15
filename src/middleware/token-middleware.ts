import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../index";
import {UserRepository} from "../repository/user-repository";
import { ObjectId} from "mongodb";
import {DeletedTokenRepoRepository} from "../repository/deletedTokenRepo-repository";
import {SecurityDevicesRepo} from "../repository/security-devices-repo";
import {neSytTypes} from "../types/neSyt-types";
import {NeSytModelClass} from "../schemas/neSyt-schemas";
import {container} from "../composition-root/composition-root";
import {JwtService} from "../application/jwt-service";


const userRepository = container.resolve<UserRepository>(UserRepository)
const deletedTokenRepoRepository = container.resolve<DeletedTokenRepoRepository>(DeletedTokenRepoRepository)
const securityDevicesRepo = container.resolve<SecurityDevicesRepo>(SecurityDevicesRepo)
const jwtService = container.resolve<JwtService>(JwtService)

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
        const device = await securityDevicesRepo.getDevice(payload.deviceId,user._id.toString())
        if(!device || device === 5){
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

export const IPRequestCounter = async (req: Request, res: Response , next: NextFunction) =>{
    const current = new Date()
    if(!req.ip){
        return next()
    }

    console.log(current, 'current')
   const newElement: neSytTypes = {
       ip: req.ip.toString(),
       way: req.url,
       createdAt: current.toISOString(),
   }

    await NeSytModelClass.insertMany(newElement)

    const timeThreshold = current;
    timeThreshold.setSeconds(current.getSeconds() - 10);

    console.log(timeThreshold, 'timeThreshold')

    const findReqInDB = await NeSytModelClass.find(
        {ip: newElement.ip.toString(), way: newElement.way,
            createdAt: { $gte: timeThreshold.toISOString() }})
        .lean()

    console.log(findReqInDB,'neSytTypes')

    if (findReqInDB.length > 5){
        return res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    }

    next()
}