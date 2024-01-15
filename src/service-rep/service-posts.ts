import {BodyPostToRequest, PostClass, PostOutputModel} from "../types/posts-type";
import {postMapper, PostsRepository} from "../repository/posts-repository";
import {BlogsRepository} from "../repository/blogs-repository";
import {injectable} from "inversify";
import "reflect-metadata"
@injectable()
export class ServicePosts {
    constructor(
        protected postsRepository: PostsRepository,
        protected blogsRepository: BlogsRepository
    ) {}

    async createNewPosts
    (bodyPost: BodyPostToRequest, blogId: string): Promise<PostOutputModel | null> {
        const findBlogName = await this.blogsRepository.getBlogsById(blogId)
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


        const result = await this.postsRepository.savePost(newPosts)
        return postMapper(result)

    }
    async updateStatusLikeInUser(commentId:string, userId: string, status:string){
        return this.postsRepository.updateStatusLikeUser(commentId, userId, status)
    }

    async updatePostsById
    (id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePostsById(id, title, shortDescription, content, blogId)
    }

    async deletePostsById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostsById(id)
    }
}
