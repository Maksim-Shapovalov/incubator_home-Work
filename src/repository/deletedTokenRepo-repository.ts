import {BlackListModel} from "../schemas/blackList-schemas";

export const deletedTokenRepoRepository = {
    async deletedTokens (token: any){
        const bannedToken = await BlackListModel.insertMany({token})
        return bannedToken
    },
    async findRefreshTokenInDB(token:string){
        const refreshToken = await BlackListModel.findOne({token})
        if (!refreshToken){
            return null
        }
        return refreshToken.token
    }
}