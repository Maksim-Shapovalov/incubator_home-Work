import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS} from "../index";
import {jwtService} from "../application/jwt-service";
import {userRepository} from "../repository/user-repository";
import {body} from "express-validator";
export const authMiddlewareForGetCommentById = async (req: Request, res: Response, next: NextFunction) => {
    const registr = req.headers.authorization
    if (!registr){
        return null

    }
    const token = registr.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId){
        const user = await userRepository.getUserById(userId)

        if(user){
            req.body.user = await userRepository.getUserById(userId)
            return next()
        }
    }

    return next()

}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const registr = req.headers.authorization
    if (!registr){
        res.send(HTTP_STATUS.UNAUTHORIZED_401)
        return
    }

    const token = registr.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)


    if (userId){
        const user = await userRepository.getUserById(userId)

        if(user){
            req.body.user = await userRepository.getUserById(userId)
            return next()
        }
    }

    res.sendStatus(HTTP_STATUS.UNAUTHORIZED_401)
}

export const CheckingAuthorizationValidationCode = () => ([
    body("code")
        .custom(async (value)=>{
            const codeUsers = await userRepository.findUsersbyCode(value)
            if (!codeUsers)throw new Error('user not found')
            if (codeUsers.emailConfirmation.isConfirmed === true)throw new Error('user is registered')
            if (codeUsers.emailConfirmation.expirationDate < new Date().toISOString())throw new Error('date')
            if (codeUsers.emailConfirmation.confirmationCode !== value) throw new Error('user not found')

            return true
        })
])