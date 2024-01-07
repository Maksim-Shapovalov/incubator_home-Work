import {BodyPostToRequest, PostClass, PostOutputModel} from "../types/posts-type";
import {postMapper, PostsRepository} from "../repository/posts-repository";
import {BlogsRepository} from "../repository/blogs-repository";


export class ServicePosts {
    postsRepository: PostsRepository;
    private blogsRepository: BlogsRepository;
    constructor() {
        this.postsRepository = new PostsRepository()
        this.blogsRepository = new BlogsRepository()
    }
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

    async updatePostsById
    (id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePostsById(id, title, shortDescription, content, blogId)
    }

    async deletePostsById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostsById(id)
    }
}
