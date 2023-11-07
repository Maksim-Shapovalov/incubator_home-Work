

export type UserOutputModel = {
    id: string
    login: string
    email: string
    passwordHash: any
    passwordSalt: string
    createdAt: string
}

export type UserToPostsOutputModel = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type UserToPostsDBModel = {
    login: string
    email: string
    createdAt: string
}



export type UserToCodeOutputModel = {
    login: string
    email: string
    createdAt: string
    emailConfirmation: emailConfirmations
}


export type UserDbType = {
    login: string
    email: string
    passwordHash: any
    passwordSalt: string
    createdAt: string
    emailConfirmation: emailConfirmations
}
type emailConfirmations = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}
export type RegistrationType = {
    ip: string
}
export type SentEmailType = {
    sentData: Date
}