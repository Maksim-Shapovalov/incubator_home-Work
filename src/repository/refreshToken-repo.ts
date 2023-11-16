import {dataID} from "../DB/data-base";

export const refreshTokenRepo= {
    async AddRefreshTokenInData(token: any){
         await dataID.insertOne(token)
        return true
    }
}