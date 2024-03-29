import mongoose from "mongoose";
import {PostLikesDB, PostsType} from "../types/posts-type";
import {AvailableStatusEnum} from "../types/comment-type";

const postLike = new mongoose.Schema<PostLikesDB>({
    postId: {type: String, required: true},
    likesStatus:  {
        type: String,
        enum: Object.values(AvailableStatusEnum),
        required:true
    },
    userId: {type: String, required: true},
    createdAt: {type: String, required: true},
    login: {type: String, required: true}
})




const postSchema = new mongoose.Schema<PostsType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},


})
export const PostLikesModelClass = mongoose.model('PostLikes', postLike)
export const PostModelClass = mongoose.model('posts', postSchema)