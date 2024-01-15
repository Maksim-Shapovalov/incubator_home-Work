
import {newDataUser2, UserRepository} from "../repository/user-repository";
import {v4 as uuidv4} from "uuid";
import {randomUUID} from "crypto";
import bcrypt from "bcrypt";
import {ServiceUser} from "../service-rep/service-user";
import {injectable} from "inversify";
import "reflect-metadata"
import {EmailManager} from "../manager/email-manager";


@injectable()
export class AuthService{
    constructor(
        protected userRepository: UserRepository,
        protected serviceUser: ServiceUser,
        protected emailManager: EmailManager
    ) {}
    async doOperation(user: any){
        await this.emailManager.sendEmailRecoveryMessage(user)
    }
    async confirmatoryUser(code:string){
        return this.userRepository.getUserByCode(code)
    }
    async findUserByRecoveryCode(newDataUser: newDataUser2){

        newDataUser.newSalt = await bcrypt.genSalt(10)
        newDataUser.newPassword = await this.serviceUser._generateHash(newDataUser.newPassword, newDataUser.newSalt)


        return  this.userRepository.findUserByRecoveryCode(newDataUser)
    }
    async findUserByEmail(user:any){
        const newConfirmationCode = {
            confirmationCode: uuidv4(),
        }
        const result = await this.userRepository.updateCodeToResendingMessage(user.email, newConfirmationCode)
        await this.emailManager.repeatSendEmailRecoveryMessage(result!.email, result!.login, result!.emailConfirmation.confirmationCode)//email, code
    }
    async sendEmailMessage(email:string) {
        const recoveryCode = randomUUID()
        const possibleUser = {
            email: email,
            recoveryCode: recoveryCode
        }
        await this.userRepository.findByEmailAndAddRecoveryode(possibleUser)
        await this.emailManager.sendEmailWithTheCode(email, recoveryCode)
    }
}

