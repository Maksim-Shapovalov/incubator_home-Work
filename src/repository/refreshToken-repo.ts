import {DataIDModelClass} from "../schemas/dataID-schemas";
import {DevicesUserDB} from "../types/device-of-user";
import {injectable} from "inversify";
import "reflect-metadata"
@injectable()
export class RefreshTokenRepo {
    async AddRefreshTokenInData(token: DevicesUserDB) {
        await DataIDModelClass.insertMany(token)
        return true
    }
}
