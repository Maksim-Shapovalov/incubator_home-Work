import jwt from 'jsonwebtoken'
import {setting} from "../setting";
import {ObjectId} from "mongodb";
import {v4 as uuidv4} from "uuid";
import {refreshTokenRepo} from "../repository/refreshToken-repo";
import {DeviceClass, DevicesUserDB} from "../types/device-of-user";
import {securityDevicesRepo} from "../repository/security-devices-repo";
import {UserToPostsOutputModel} from "../types/user-type";

type PayloadType = {
    userId: string
    deviceId: string
}
type PayloadTypeRefresh = {
    userId: string,
    deviceId: string,
    iat: number,
    exp: number

} | null

export class JwtService{
    async createdJWTAndInsertDevice(user: UserToPostsOutputModel, userAgent: any = null) {
        const createRefreshTokenMeta = new DeviceClass(
            userAgent.IP || '123',
            userAgent.deviceName || 'internet',
            new Date().toISOString(),
            uuidv4(),
            user.id)


        await refreshTokenRepo.AddRefreshTokenInData(createRefreshTokenMeta)
        const accessToken: string = jwt.sign({userId: user.id},
            setting.JWT_SECRET, {expiresIn: '10000sec'})
        const refreshToken: string = jwt.sign({userId: user.id, deviceId: createRefreshTokenMeta.deviceId},
            setting.JWT_REFRESH_SECRET, {expiresIn: '20000sec'})


        return {accessToken, refreshToken}

    }
    async updateJWT(user: UserToPostsOutputModel, oldRefreshToken: string) {
        const parser = (jwt.decode(oldRefreshToken) as PayloadTypeRefresh)
        console.log("PARSER________", parser)
        if (!parser) {
            return null
        }
        const createRefreshTokenMeta = {
            deviceId: parser.deviceId,
            userId: user.id
        }
        await securityDevicesRepo.updateDevice(createRefreshTokenMeta.deviceId)

        const accessToken: string = jwt.sign({userId: user.id},
            setting.JWT_SECRET, {expiresIn: '10000sec'})
        const refreshToken: string = jwt.sign({userId: user.id, deviceId: createRefreshTokenMeta.deviceId},
            setting.JWT_REFRESH_SECRET, {expiresIn: '1000sec'})
        return {accessToken, refreshToken}
    }
    async parseJWTRefreshToken(refreshToken: string) {
        try {
            const payload = jwt.verify(refreshToken, setting.JWT_REFRESH_SECRET)
            console.log("PAYLOAD___________________", payload)


            return payload as PayloadType
        } catch (e) {
            console.error('error in verify token:', e)
            return null
        }
    }
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, setting.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }

    }
}

export const jwtService = new JwtService()