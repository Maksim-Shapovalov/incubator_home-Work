import {NextFunction, Request, Response} from "express";
import {app, HTTP_STATUS} from "../index";
import {jwtService} from "../application/jwt-service";
import {userRepository} from "../repository/user-repository";
import {FindCursor, ObjectId, WithId} from "mongodb";
import {deletedTokenRepoRepository} from "../repository/deletedTokenRepo-repository";
import {securityDevicesRepo} from "../repository/security-devices-repo";
import {neSyt} from "../DB/data-base";
import {neSytTypes} from "../types/neSyt-types";
import {cy} from "date-fns/locale";

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

    await neSyt.insertOne(newElement)

    const timeThreshold = current;
    timeThreshold.setSeconds(current.getSeconds() - 10);

    console.log(timeThreshold, 'timeThreshold')

    const findReqInDB = await neSyt.find(
        {ip: newElement.ip.toString(), way: newElement.way,
            createdAt: { $gte: timeThreshold.toISOString() }})
        .toArray()

    console.log(findReqInDB,'neSytTypes')

    if (findReqInDB.length > 5){
        return res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
    }

    next()
}
// let requestCounts: { [key: string]: number[] } = {};
// const ip = req.ip
//
// if (!requestCounts[ip]) {
//     requestCounts[ip] = [];
// }
//
// const currentTime = new Date().getTime();
//
// requestCounts[ip].push(currentTime);
//
// requestCounts[ip] = requestCounts[ip].filter((time) => time > currentTime - 10000);
//
// if (requestCounts[ip].length > 5) {
//     return res.sendStatus(HTTP_STATUS.TOO_MANY_REQUESTS_429)
// }
//
// next();