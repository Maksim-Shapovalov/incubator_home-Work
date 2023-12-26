import {BlackListModel} from "../schemas/blackList-schemas";

export class DeletedTokenRepoRepository {
    async deletedTokens(token: any) {
        return BlackListModel.insertMany({token})

    }

    async findRefreshTokenInDB(token: string) {
        const refreshToken = await BlackListModel.findOne({token})
        if (!refreshToken) {
            return null
        }
        return refreshToken.token
    }
}

export const deletedTokenRepoRepository = new DeletedTokenRepoRepository()