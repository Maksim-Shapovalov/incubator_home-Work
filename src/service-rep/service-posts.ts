import {BodyPostToRequest, PostClass, PostOutputModel, PostsOutputType} from "../types/posts-type";
import {postsLikeMapper, PostsRepository} from "../repository/posts-repository";
import {BlogsRepository} from "../repository/blogs-repository";
import {injectable} from "inversify";
import "reflect-metadata"
import {WithId} from "mongodb";
import {UserMongoDbType} from "../types/user-type";
@injectable()
export class ServicePosts {
    constructor(
        protected postsRepository: PostsRepository,
        protected blogsRepository: BlogsRepository
    ) {}

    async createNewPosts
    (bodyPost: BodyPostToRequest, blogId: string, user: string| null): Promise<PostOutputModel | null> {

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
            new Date().toISOString(),



        )


        const result = await this.postsRepository.savePost(newPosts)
        return postsLikeMapper(result, user)

    }
    async updateStatusLikeInUser(postId:string, user: UserMongoDbType, status:string){
        return this.postsRepository.updateStatusLikeUser(postId, user, status)
    }

    async updatePostsById
    (id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePostsById(id, title, shortDescription, content, blogId)
    }

    async deletePostsById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostsById(id)
    }
}
