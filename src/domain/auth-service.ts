import {emailManager} from "../manager/email-manager";
import { newDataUser2, userRepository} from "../repository/user-repository";
import {v4 as uuidv4} from "uuid";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {serviceUser} from "../service-rep/service-user";

export class AuthService{
    async doOperation(user: any){
        await emailManager.sendEmailRecoveryMessage(user)
    }
    async confirmatoryUser(code:string){
        return await userRepository.getUserByCode(code)
    }
    async findUserByRecoveryCode(newDataUser: newDataUser2){

        newDataUser.newSalt = await bcrypt.genSalt(10)
        newDataUser.newPassword = await serviceUser._generateHash(newDataUser.newPassword, newDataUser.newSalt)


        return  userRepository.findUserByRecoveryCode(newDataUser)
    }
    async findUserByEmail(user:any){
        const newConfirmationCode = {
            confirmationCode: uuidv4(),
        }
        const result = await userRepository.updateCodeToResendingMessage(user.email, newConfirmationCode)
        await emailManager.repeatSendEmailRecoveryMessage(result!.email, result!.login, result!.emailConfirmation.confirmationCode)//email, code
    }
    async sendEmailMessage(email:string) {
        const recoveryCode = randomUUID()
        const possibleUser = {
            email: email,
            recoveryCode: recoveryCode
        }
        await userRepository.findByEmailAndAddRecoveryode(possibleUser)
        await emailManager.sendEmailWithTheCode(email, recoveryCode)
    }
}

export const authService = new AuthService()