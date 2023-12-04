import {dataBlackListForToken} from "../DB/data-base";

export const deletedTokenRepoRepository = {
    async deletedTokens (token: any){
        await dataBlackListForToken.insertOne(token)
    },
    async findRefreshTokenInDB(token:string){
        const refreshToken = await dataBlackListForToken.findOne({token})
        if (!refreshToken){
            return null
        }
        return refreshToken.token
    }
}