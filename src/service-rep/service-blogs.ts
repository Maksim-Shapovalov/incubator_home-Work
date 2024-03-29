import {BlogClass, BlogRequest, BlogsOutputModel, BlogsType} from "../types/blogs-type";
import {WithId} from "mongodb";
import {BlogsRepository} from "../repository/blogs-repository";
import {injectable} from "inversify";
import "reflect-metadata"
@injectable()
export class ServiceBlogs {
    constructor(protected blogsRepository: BlogsRepository) {}
    async createNewBlogs(blog: BlogRequest): Promise<BlogsOutputModel> {

        const newBlogs = new BlogClass(
            blog.name,
            blog.description,
            blog.websiteUrl,
            new Date().toISOString(),
            false
        )


        const res = await this.blogsRepository.saveBlog(newBlogs)
        return  blogMapper(res)

    }
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsRepository.updateBlogById(id, name, description, websiteUrl)
    }
    async deleteBlogsById(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlogsById(id)

    }
}
const blogMapper = (blog: WithId<BlogsType>): BlogsOutputModel => {
    return {
        id: blog._id.toHexString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}