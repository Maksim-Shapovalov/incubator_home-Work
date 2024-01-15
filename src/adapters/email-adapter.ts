import nodemailer from "nodemailer";
import {injectable} from "inversify";
import "reflect-metadata"
@injectable()
export class EmailAdapter{
    async sendEmail(createUser:any, message:string) {
        try{

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'maksim.shapovalov.01@gmail.com',
                    pass: 'wewedrlwgkkmoswq'
                }
            });
//createUser.email
            let info =
                {

                    from: 'Maksim <maksim.shapovalov.01@gmail.com>',
                    to: createUser.email,
                    subject: createUser.login,
                    html: message
                }

            const result = await transporter.sendMail(info)
            // const timeToStart = new Date()
            return result

        }catch(e){
            console.log('error',e)
        }
    }
    async resendEmail(userEmail:string, userLogin:string , message:string) {
        try{

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'maksim.shapovalov.01@gmail.com',
                    pass: 'wewedrlwgkkmoswq'
                }
            });
//createUser.email
            let info =
                {

                    from: 'Maksim <maksim.shapovalov.01@gmail.com>',
                    to: userEmail,
                    subject: userLogin,
                    html: message
                }

            const result = await transporter.sendMail(info)
            // const timeToStart = new Date()
            return result

        }catch(e){
            console.log('error',e)
        }
    }
    async sendEmailToCode(email:string, textForSend: string){
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'maksim.shapovalov.01@gmail.com',
                    pass: 'wewedrlwgkkmoswq'
                }
            })
            let info =
                {

                    from: 'Maksim <maksim.shapovalov.01@gmail.com>',
                    to: email,
                    subject: email,
                    html: textForSend
                }
            const result = await transporter.sendMail(info)
            return result
        }catch (e){
            console.log('error',e)
        }
    }
}

