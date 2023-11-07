import jwt from 'jsonwebtoken'
import {UserToPostsOutputModel} from "../types/user-type";
import {setting} from "../setting";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createdJWT(user: UserToPostsOutputModel) {
        const token = jwt.sign({userId: user.id}, setting.JWT_SECRET, {expiresIn: '10min'})
        return token
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