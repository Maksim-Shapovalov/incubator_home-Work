import {
    UserDbType,
    UserOutputModel,
    UserToCodeOutputModel,
    UserToPostsDBModel,
    UserToPostsOutputModel
} from "../types/user-type";
import {userRepository} from "../repository/user-repository";
import bcrypt, {hash, compare} from "bcrypt"
import {v4 as uuidv4} from "uuid";
import add from 'date-fns/add'

export const serviceUser = {
    async getNewUser(login: string, password: string, email: string): Promise<UserToCodeOutputModel> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const now = new Date()

        const newUser: UserDbType = {
            login,
            email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: now.toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(now, {
                    hours: 1,
                    minutes: 3
                }).toISOString(),
                isConfirmed: false
            }
        }
        console.log(newUser)
        const result = await userRepository.getNewUser(newUser)
        return result
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