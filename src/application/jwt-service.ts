import jwt, {JwtPayload} from 'jsonwebtoken'
import {UserToPostsOutputModel} from "../types/user-type";
import {setting} from "../setting";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {refreshTokenRepo} from "../repository/refreshToken-repo";
import {DevicesUserDB} from "../types/device-of-user";

type PayloadType = {
    userId: string
}
type PayloadTypeRefresh = {
    userId: string,
    deviceId: string,
    iat: number,
    exp: number

} | null

export const jwtService = {
    async createdJWTAndInsertDevice(user: UserToPostsOutputModel, userAgent:any = null) {
        const createRefreshTokenMeta: DevicesUserDB = {
            lastActiveDate: new Date().toISOString(),
            deviceId: uuidv4(),
            ip: userAgent.IP || '123',
            title: userAgent.deviceName || 'internet',
            userId: user.id
        }
        await refreshTokenRepo.AddRefreshTokenInData(createRefreshTokenMeta)
        const accessToken:string = jwt.sign({userId: user.id},
            setting.JWT_SECRET, {expiresIn: '10000sec'})
        const refreshToken:string = jwt.sign({userId: user.id, deviceId: createRefreshTokenMeta.deviceId},
            setting.JWT_REFRESH_SECRET, {expiresIn: '20000sec'})

        const payload = jwt.decode(refreshToken)//{userId, deviceId, iat, exp}
        console.log('payload:', payload)
        return {accessToken, refreshToken}

    },
    async updateJWT(user: UserToPostsOutputModel,oldRefreshToken:string) {
        const parser =(jwt.decode(oldRefreshToken) as PayloadTypeRefresh)
        if (!parser){
            return null
        }
        const createRefreshTokenMeta = {
            lastActiveDate: new Date(parser .iat),
            deviceId: parser.deviceId,
            userId: user.id
        }
        console.log(createRefreshTokenMeta)

        const accessToken:string = jwt.sign({userId: user.id},
            setting.JWT_SECRET, {expiresIn: '10000sec'})
        const refreshToken:string = jwt.sign({userId: user.id, deviceId: createRefreshTokenMeta.deviceId},
            setting.JWT_REFRESH_SECRET, {expiresIn: '1000sec'})
        return {accessToken, refreshToken}
    },
    async parseJWTRefreshToken(refreshToken: string){
        try {
            const payload = jwt.verify(refreshToken, setting.JWT_REFRESH_SECRET)
            console.log('payload',payload)

            return payload as PayloadType
        }catch (e){
            console.error('error in verify token:', e)
          return null
        }
    },
    // async parseJWTAccessToken(accessToken: string){
    //     console.log('parse')
    //     try {
    //         const payload = jwt.verify(accessToken, setting.JWT_SECRET)
    //         console.log('paylod in parse')
    //         return payload as PayloadType
    //     }catch (e){
    //         return null
    //     }
    // },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, setting.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error){
            return null
        }

    }
}