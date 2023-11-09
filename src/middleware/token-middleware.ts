import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../index";
import {jwtService} from "../application/jwt-service";
import {userRepository} from "../repository/user-repository";
import {ObjectId} from "mongodb";
import {dataBlackListForToken} from "../DB/data-base";

export const ValidationRefreshToken = async (req: Request, res: Response , next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken){
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        return
    }
    const findTokenInBlackList = await dataBlackListForToken.findOne({refreshToken: refreshToken})
    if (findTokenInBlackList){
        res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
        return
    }

    const payload = await jwtService.parseJWTRefreshToken(refreshToken);
    const bannedToken = {
        token: refreshToken
    }
    await dataBlackListForToken.insertOne(bannedToken)
    if (payload){
        const userId = new ObjectId(payload.userId) ;
        const user = await userRepository.getUserById(userId)

        if(!user){
            res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
            return
        }

        req.body.user = user

        next()
        return;
    }else{
        return res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
    }
}