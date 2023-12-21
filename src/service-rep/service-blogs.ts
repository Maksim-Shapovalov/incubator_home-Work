import {BlogRequest, BlogsOutputModel, BlogsType} from "../types/blogs-type";
import {WithId} from "mongodb";
import {blogsRepository} from '../repository/blogs-repository'
import {BlogModelClass} from "../schemas/blog-schemas";

export const blogsService = {
    async createNewBlogs(blog: BlogRequest): Promise<BlogsOutputModel> {

        const newBlogs = new BlogModelClass()

        newBlogs.name = blog.name
        newBlogs.description = blog.description
        newBlogs.websiteUrl = blog.websiteUrl
        newBlogs.createdAt = new Date().toISOString()
        newBlogs.isMembership = false

        // const newBlogs : BlogsType = {
        //     name: name,
        //     description: description,
        //     websiteUrl: websiteUrl,
        //     createdAt: new Date().toISOString(),
        //     isMembership: false
        // }
        const res = await blogsRepository.saveBlog(newBlogs)
        const correctBlog = blogMapper(res)
        return correctBlog
    },
    async updateBlogById(id: string, name:string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlogById(id, name, description, websiteUrl)
    },
    async deleteBlogsById(id: string) :Promise<boolean> {
        return await blogsRepository.deleteBlogsById(id)

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