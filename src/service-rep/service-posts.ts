import {BodyPostToRequest, PostClass, PostOutputModel} from "../types/posts-type";
import {postMapper, postsRepository} from "../repository/posts-repository";
import {blogsRepository} from "../repository/blogs-repository";
import {PostModelClass} from "../schemas/post-schema";


export class ServicePosts {
    async createNewPosts
    (bodyPost: BodyPostToRequest, blogId: string): Promise<PostOutputModel | null> {
        const findBlogName = await blogsRepository.getBlogsById(blogId)
        if (!findBlogName) {
            return null
        }

        const newPosts = new PostClass(
            bodyPost.title,
            bodyPost.shortDescription,
            bodyPost.content,
            blogId,
            findBlogName.name,
            new Date().toISOString()
        )


        const result = await postsRepository.savePost(newPosts)
        return postMapper(result)

    }

    async updatePostsById
    (id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePostsById(id, title, shortDescription, content, blogId)
    }

    async deletePostsById(id: string): Promise<boolean> {
        return await postsRepository.deletePostsById(id)
    }
}

export const postsService = new ServicePosts()
