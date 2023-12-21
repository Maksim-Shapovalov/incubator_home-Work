import mongoose from "mongoose";
import {CommentsTypeDb} from "../types/comment-type";

const commentSchema = new mongoose.Schema<CommentsTypeDb>({
    content: {type: String, required: true},
    commentatorInfo: {type: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    }, required: true},
    postId: {type: String, required: true},
    createdAt: {type: String, required: true},

})
export const CommentsModelClass = mongoose.model('comments', commentSchema)