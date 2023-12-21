import {BodyPostToRequest, PostOutputModel} from "../types/posts-type";
import {postMapper, postsRepository} from "../repository/posts-repository";
import {blogsRepository} from "../repository/blogs-repository";
import {PostModelClass} from "../schemas/post-schema";

export const postsService = {
    async createNewPosts
    (bodyPost: BodyPostToRequest,blogId:string): Promise<PostOutputModel | null> {
        const findBlogName = await blogsRepository.getBlogsById(blogId)
        if (!findBlogName){
            return null
        }

        const newPosts = new PostModelClass()

        newPosts.title =  bodyPost.title,
        newPosts.shortDescription =  bodyPost.shortDescription,
        newPosts.content =  bodyPost.content,
        newPosts.blogId =  blogId,
        newPosts.blogName =  findBlogName.name ,
        newPosts.createdAt =  new Date().toISOString()


        const result = await postsRepository.savePost(newPosts)
        const correctPost = postMapper(result)
        return correctPost
    },
    async updatePostsById
    (id: string, title:string,shortDescription:string,content:string,blogId:string): Promise<boolean> {
        return await postsRepository.updatePostsById(id,title,shortDescription,content,blogId)
    },
    async deletePostsById(id: string): Promise<boolean>{
        return await postsRepository.deletePostsById(id)
    }

}
