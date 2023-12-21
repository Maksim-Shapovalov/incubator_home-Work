import mongoose from "mongoose";
import {BlogsType} from "../types/blogs-type";
import {PostsType} from "../types/posts-type";

const postSchema = new mongoose.Schema<PostsType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},


})
export const PostModelClass = mongoose.model('posts', postSchema)