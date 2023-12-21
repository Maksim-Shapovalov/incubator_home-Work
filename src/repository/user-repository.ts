import { PaginationType, UserPaginationQueryType} from "./qurey-repo/query-filter";
import {
    UserMongoDbType, UserOutputModel, UserToShow,
} from "../types/user-type";
import {ObjectId, WithId} from "mongodb";
import add from "date-fns/add";
import {UserModelClass} from "../schemas/user-schemas";
type possibleUser = {
    email: string,
    recoveryCode: string
}
export type newDataUser={
    newPassword: string,
    recoveryCode: string
}
export const userRepository = {
    async getAllUsers(filter:UserPaginationQueryType): Promise<PaginationType<UserToShow> | null>{
        const filterQuery = {$or: [
            {login: {$regex:filter.searchLoginTerm, $options: 'i'}},
                {email: {$regex: filter.searchEmailTerm, $options: 'i'}}
            ]}

        const pageSizeInQuery: number = filter.pageSize;
        const totalCountUsers = await UserModelClass.countDocuments(filterQuery)

        const pageCountUsers: number = Math.ceil(totalCountUsers / pageSizeInQuery)
        const pageBlog: number = ((filter.pageNumber - 1) * pageSizeInQuery)
        const result = await UserModelClass
            .find(filterQuery)
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageBlog)
            .limit(pageSizeInQuery)
            .lean()
        const items = result.map((u) => userToPostMapper(u))
        return {
            pagesCount: pageCountUsers,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountUsers,
            items: items
        }
    },
    async getUserById(id:ObjectId):Promise<UserMongoDbType | null>{
        return UserModelClass.findOne({_id: id}).lean()

    },
    async findUsersbyCode(codeUser:string){
        return  UserModelClass.findOne({'emailConfirmation.confirmationCode': codeUser})


    },
    async getUserByCode(codeUser:string): Promise<boolean>{
       const res = await UserModelClass.updateOne({'emailConfirmation.confirmationCode': codeUser}, {
            $set: {
                'emailConfirmation.isConfirmed' : true
            }
        })
        return res.matchedCount === 1

    },

    async findByLoginOrEmail(loginOrEmail: string){
        const findUser = await UserModelClass.findOne({ $or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        return findUser

    },

    async findByEmailAndAddRecoveryode(possibleUser:possibleUser){
        const findUser = await UserModelClass.findOne({email: possibleUser.email})
        if (!findUser) return false
        findUser.recoveryCode = possibleUser.recoveryCode
        return findUser

    },
    async findUserByRecoveryCode(newDataUser: newDataUser){
      const user = await  UserModelClass.findOne({recoveryCode: newDataUser.recoveryCode})
        if (!user) return false
        if (user.passwordHash === newDataUser.newPassword) return false
        user.passwordHash = newDataUser.newPassword
        console.log("passwordHash---------",user.passwordHash)
        return user
    },

    async updateCodeToResendingMessage(userEmail: string, info: any){
        await UserModelClass.updateOne({email : userEmail}, {
            $set:{
                'emailConfirmation.confirmationCode': info.confirmationCode,
                'emailConfirmation.expirationDate': add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toISOString()
            }
        })
        const user = await UserModelClass.findOne({email:userEmail})
        console.log('result',user)
        return user
    },
    // async getNewUser(newUser: UserMongoDbType): Promise<UserMongoDbType>{
    //     const result = await UserModelClass.insertMany([newUser])
    //     return userMapper({...newUser})
    // },
    async deleteUserById(userId:string): Promise<boolean>{
        const findUser = await UserModelClass.deleteOne({_id:new ObjectId(userId)})
        return findUser.deletedCount === 1
    },

    async saveUser(user:UserMongoDbType): Promise<UserMongoDbType>{

        // const userModel = new UserModelClass(user)
        // console.log("user Model-----", JSON.stringify(userModel), JSON.stringify(userModel.save()))
        // await UserModelClass.insertMany([user])

        return UserModelClass.create(user)


    }

}

export const userMapper = (user: WithId<UserMongoDbType>): UserOutputModel => {
    return {
        id: user._id.toHexString(),
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        createdAt: user.createdAt
    }
}
export const userToPostMapper = (user: WithId<UserMongoDbType>): UserToShow => {
    return {
        id: user._id.toHexString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
// export const UserToCodeMapper = (user: WithId<UserMongoDbType>): UserToCodeOutputModel => {
//     return {
//         login: user.login,
//         email: user.email,
//         createdAt: user.createdAt,
//         emailConfirmation: user.emailConfirmation
//     }
//
// }