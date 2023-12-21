import {
    UserBasicRequestBody,
    UserMongoDbType, UserToShow,
    // UserOutputModel,
    // UserToCodeOutputModel,
    // UserToPostsDBModel,
    // UserToPostsOutputModel
} from "../types/user-type";
import {userRepository, userToPostMapper} from "../repository/user-repository";
import bcrypt, {hash, compare} from "bcrypt"
import {v4 as uuidv4} from "uuid";
import add from 'date-fns/add'
import {UserModelClass} from "../schemas/user-schemas";
import {randomUUID} from "crypto";

export const serviceUser = {
    async getNewUser(user: UserBasicRequestBody): Promise<UserToShow> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(user.password, passwordSalt)

        const now = new Date()

        const newUser = new UserModelClass()

        newUser.login = user.login
        newUser.email = user.email
        newUser.passwordHash = passwordHash
        newUser.passwordSalt = passwordSalt
        newUser.createdAt = now.toISOString()
        newUser.emailConfirmation = {
            confirmationCode: randomUUID(),
            expirationDate: add(now, {
                hours: 1,
                minutes: 3
            }).toISOString(),
           isConfirmed: false
        }



        const result:UserMongoDbType = await userRepository.saveUser(newUser)
        const correctUser = userToPostMapper(result)
        return correctUser
    },
    async deleteUserById(userId: string): Promise<boolean> {
        return await userRepository.deleteUserById(userId)
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        // if (!user.emailConfirmation.isConfirmed) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user
    }
}