import {BlogClass, BlogRequest, BlogsOutputModel, BlogsType} from "../types/blogs-type";
import {WithId} from "mongodb";
import {blogsRepository} from '../repository/blogs-repository'

export class ServiceBlogs {
    async createNewBlogs(blog: BlogRequest): Promise<BlogsOutputModel> {

        const newBlogs = new BlogClass(
            blog.name,
            blog.description,
            blog.websiteUrl,
            new Date().toISOString(),
            false
        )


        const res = await blogsRepository.saveBlog(newBlogs)
        return  blogMapper(res)

    }
    async updateBlogById(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, name, description, websiteUrl)
    }
    async deleteBlogsById(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlogsById(id)

    }
}

export const blogsService = new ServiceBlogs()
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