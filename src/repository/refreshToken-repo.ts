import {DataIDModelClass} from "../schemas/dataID-schemas";
import {DevicesUserDB} from "../types/device-of-user";

export class RefreshTokenRepo {
    async AddRefreshTokenInData(token: DevicesUserDB) {
        await DataIDModelClass.insertMany(token)
        return true
    }
}

export const refreshTokenRepo = new RefreshTokenRepo()