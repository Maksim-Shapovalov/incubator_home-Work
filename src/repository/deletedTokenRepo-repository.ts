import {dataBlackListForToken} from "../DB/data-base";

export const deletedTokenRepoRepository = {
    async deletedTokens (token: string){
        await dataBlackListForToken.insertOne({token})
    }
}