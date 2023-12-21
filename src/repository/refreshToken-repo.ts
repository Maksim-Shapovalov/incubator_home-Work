
import {DataIDModelClass} from "../schemas/dataID-schemas";
import {DevicesUserDB} from "../types/device-of-user";

export const refreshTokenRepo= {
    async AddRefreshTokenInData(token: DevicesUserDB){
         await DataIDModelClass.insertMany(token)
        return true
    }
}