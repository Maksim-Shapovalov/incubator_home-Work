import {emailManager} from "../manager/email-manager";
import {userRepository} from "../repository/user-repository";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import now = jest.now;

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
    // async verificationTimeToMessage(user: UserToCodeOutputModel){
    //     if (user.emailConfirmation.expirationDate)
    // }

    // async registrationUser(login: any, password:any, email:any) {
    //     const createUser = {
    //         login: login,
    //         password: password,
    //         email: email
    //     }
    //     await emailManager.sendEmailRecoveryMessage(createUser)
    // },
    // async confirmRegistration(code:string){
    //     await emailManager.sendEmailRecoveryMessage({})
    // }


}