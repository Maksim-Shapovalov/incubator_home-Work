import {WithId} from "mongodb";
export type UserOutputModel = {
    id: string
    login: string
    email: string
    passwordHash: any
    passwordSalt: string
    createdAt: string
}
//
export type UserToPostsOutputModel = {
    id: string
    login: string
    email: string
    createdAt: string
}
//
export type UserToShow = {
    id: string
    login: string
    email: string
    createdAt: string
}
//
// export type UserToCodeOutputModel = {
//     login: string
//     email: string
//     createdAt: string
//     emailConfirmation: EmailConfirmations
// }

export type UserBasicRequestBody = {
    login: string
    email: string
    password: string
}



export type UserMongoDbType = WithId<{
    login: string
    email: string
    passwordHash: any
    passwordSalt: string
    createdAt: string
    emailConfirmation: EmailConfirmations
    recoveryCode:string
}>

export type EmailConfirmations = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}
