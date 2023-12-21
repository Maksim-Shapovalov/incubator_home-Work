import {emailManager} from "../manager/email-manager";
import {userRepository} from "../repository/user-repository";
import {v4 as uuidv4} from "uuid";

export const authService = {
    async doOperation(user: any){
       await emailManager.sendEmailRecoveryMessage(user)
    },
    async confirmatorUser(code:string){
        return await userRepository.getUserByCode(code)
    },
    async findUserByEmail(user:any){
        const newConfirmationCode = {
            confirmationCode: uuidv4(),
        }
        const result = await userRepository.updateCodeToResendingMessage(user.email, newConfirmationCode)
        await emailManager.repeatSendEmailRecoveryMessage(result!.email, result!.login, result!.emailConfirmation.confirmationCode)//email, code
    },
    async sendEmailMessage(email:string) {
        await emailManager.sendEmailWithTheCode(email)
    }


}