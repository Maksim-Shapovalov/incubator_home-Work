import {
    UserBasicRequestBody, UserDbType,
    UserMongoDbType, UserToShow,
} from "../types/user-type";
import {userRepository, userToPostMapper} from "../repository/user-repository";
import bcrypt from "bcrypt"
import add from 'date-fns/add'
import {randomUUID} from "crypto";
export class ServiceUser {
    async getNewUser(user: UserBasicRequestBody): Promise<UserToShow> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passwordSalt)

        const now = new Date()

        const newUser = new UserDbType(
            user.login,
            user.email,
            passwordHash,
            passwordSalt,
            now.toISOString(),
            {confirmationCode: randomUUID(),
                expirationDate: add(now, {
                    hours: 1,
                    minutes: 3
                }).toISOString(),
                isConfirmed: false
            },
            ''
        )


        const result:UserMongoDbType = await userRepository.saveUser(newUser)
        return userToPostMapper(result)
    }
    async deleteUserById(userId: string): Promise<boolean> {
        return await userRepository.deleteUserById(userId)
    }
    async _generateHash(password: string, salt: string) {
        return bcrypt.hash(password, salt)
    }
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false

        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    }

}
export const serviceUser = new ServiceUser()