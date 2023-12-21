import mongoose from "mongoose";
import {UserMongoDbType} from "../types/user-type";



const userSchema = new mongoose.Schema<UserMongoDbType>({
    // _id: String,
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    emailConfirmation: {type: {
            confirmationCode: {type: String, required: true},
            expirationDate: {type: String, required: true},
            isConfirmed: {type: Boolean, required: true}
        }, required: true}
})
export const UserModelClass = mongoose.model('users', userSchema)