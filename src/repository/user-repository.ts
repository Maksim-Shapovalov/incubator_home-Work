import { PaginationType, UserPaginationQueryType} from "./qurey-repo/query-filter";
import {dataBlog, dataUser} from "../DB/data-base";
import {
    UserDbType,
    UserOutputModel,
    UserToCodeOutputModel,
    UserToPostsDBModel,
    UserToPostsOutputModel
} from "../types/user-type";
import {ObjectId, WithId} from "mongodb";
import {blogMapper} from "./blogs-repository";
import add from "date-fns/add";

export const userRepository = {
    async getAllUsers(filter:UserPaginationQueryType): Promise<PaginationType<UserToPostsOutputModel> | null>{
        const filterQuery = {$or: [
            {login: {$regex:filter.searchLoginTerm, $options: 'i'}},
                {email: {$regex: filter.searchEmailTerm, $options: 'i'}}
            ]}

        const pageSizeInQuery: number = filter.pageSize;
        const totalCountUsers = await dataUser.countDocuments(filterQuery)

        const pageCountUsers: number = Math.ceil(totalCountUsers / pageSizeInQuery)
        const pageBlog: number = ((filter.pageNumber - 1) * pageSizeInQuery)
        const result = await dataUser
            .find(filterQuery)
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageBlog)
            .limit(pageSizeInQuery)
            .toArray()
        const items = result.map((u) => userToPostMapper(u))
        return {
            pagesCount: pageCountUsers,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountUsers,
            items: items
        }
    },
    async getUserById(id:ObjectId){
        const findUser = await dataUser.findOne({_id: id})

        return findUser
    },
    async findUsersbyCode(codeUser:string){
        const res = await dataUser.findOne({'emailConfirmation.confirmationCode': codeUser})
        console.log(res)
        return res

    },
    async getUserByCode(codeUser:string): Promise<boolean>{
       const res = await dataUser.updateOne({'emailConfirmation.confirmationCode': codeUser}, {
            $set: {
                'emailConfirmation.isConfirmed' : true
            }
        })
        return res.matchedCount === 1

    },
    async findByLoginOrEmail(loginOrEmail: string){
        const findUser = await dataUser.findOne({ $or: [{login: loginOrEmail}, {email: loginOrEmail}]})
        return findUser

    },

    async updateCodeToResendingMessage(userEmail: string, info: any){
        await dataUser.updateOne({email : userEmail}, {
            $set:{
                'emailConfirmation.confirmationCode': info.confirmationCode,
                'emailConfirmation.expirationDate': add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toISOString()
            }
        })
        const user = await dataUser.findOne({email:userEmail})
        console.log('result',user)
        return user
    },
    async getNewUser(newUser: UserDbType): Promise<UserToCodeOutputModel>{
        const result = await dataUser.insertOne({...newUser})
        return UserToCodeMapper({...newUser, _id: result.insertedId})
    },
    async deleteUserById(userId:string): Promise<boolean>{
        const findUser = await dataUser.deleteOne({_id:new ObjectId(userId)})
        return findUser.deletedCount === 1
    }
}

export const userMapper = (user: WithId<UserDbType>): UserOutputModel => {
    return {
        id: user._id.toHexString(),
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        createdAt: user.createdAt
    }
}
export const userToPostMapper = (user: WithId<UserToPostsDBModel>): UserToPostsOutputModel => {
    return {
        id: user._id.toHexString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const UserToCodeMapper = (user: WithId<UserDbType>): UserToCodeOutputModel => {
    return {
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        emailConfirmation: user.emailConfirmation
    }

}