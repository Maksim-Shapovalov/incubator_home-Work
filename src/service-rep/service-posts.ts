import {PostOutputModel, PostsType} from "../types/posts-type";
import {postsRepository} from "../repository/posts-repository";
import {blogsRepository} from "../repository/blogs-repository";

export const postsService = {
    async createNewPosts
    (title:string,shortDescription:string,content:string,blogId:string): Promise<PostOutputModel | null> {
        const findBlogName = await blogsRepository.getBlogsById(blogId)
        console.log(findBlogName)
        if (!findBlogName){
            return null
        }
        const newPosts: PostsType  = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: findBlogName.name,
            createdAt: new Date().toISOString(),
        }
        const result = await postsRepository.createNewPosts(newPosts)
        return result
    },
    async updatePostsById
    (id: string, title:string,shortDescription:string,content:string,blogId:string): Promise<boolean> {
        return await postsRepository.updatePostsById(id,title,shortDescription,content,blogId)
    },
    async deletePostsById(id: string): Promise<boolean>{
        return await postsRepository.deletePostsById(id)
    }

}
