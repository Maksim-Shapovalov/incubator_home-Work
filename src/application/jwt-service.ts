import jwt from 'jsonwebtoken'
import {UserToPostsOutputModel} from "../types/user-type";
import {setting} from "../setting";
import {ObjectId} from "mongodb";
import {deletedTokenRepoRepository} from "../repository/deletedTokenRepo-repository";

type PayloadType = {
    userId: string
}

export const jwtService = {
    async createdJWT(user: UserToPostsOutputModel) {
        console.log( setting.JWT_REFRESH_SECRET, ' setting.JWT_REFRESH_SECRET')
        const accessToken:string = jwt.sign({userId: user.id},
            setting.JWT_SECRET, {expiresIn: '10sec'})
        const refreshToken:string = jwt.sign({userId: user.id},
            setting.JWT_REFRESH_SECRET, {expiresIn: '20sec'})
        return [accessToken, refreshToken]

    },
    async parseJWTRefreshToken(refreshToken: string){
        try {
            const payload = jwt.verify(refreshToken, setting.JWT_REFRESH_SECRET)

            return payload as PayloadType
        }catch (e){
          return null
        }
    },
    async deletedTokens(token:string){
      await deletedTokenRepoRepository.deletedTokens(token)
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, setting.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error){
            return null
        }

    }
}