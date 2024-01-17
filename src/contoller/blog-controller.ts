import {injectable} from "inversify";
import {ServicePosts} from "../service-rep/service-posts";
import {ServiceBlogs} from "../service-rep/service-blogs";
import {BlogsRepository} from "../repository/blogs-repository";
import {PostsRepository} from "../repository/posts-repository";
import {Request, Response} from "express";
import {queryFilter, searchNameInBlog} from "../repository/qurey-repo/query-filter";
import {HTTP_STATUS} from "../index";
import "reflect-metadata"
@injectable()
export class BlogController {

    constructor(
        protected postsService: ServicePosts,
        protected blogsService: ServiceBlogs,
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository
    ) {
    }

    async getAllBlogs(req: Request, res: Response) {
        const filter = searchNameInBlog(req.query);
        const allBlogs = await this.blogsRepository.getAllBlogs(filter);
        res.status(HTTP_STATUS.OK_200).send(allBlogs)
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogsRepository.getBlogsById(req.params.id)
        if (blog) {
            res.status(HTTP_STATUS.OK_200).send(blog)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
    }

    async getPostsByBlogId(req: Request, res: Response) {
        const user = req.body.user
        const filter = queryFilter(req.query);
        const result = await this.postsRepository.getPostInBlogs(req.params.id, filter, user._id.toString())
        if (!result) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return res.send(result)
    }

    async createPostInBlogByBlogId(req: Request, res: Response) {
        const user = req.body.user
        const postBody = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        }
        const newPost = await this.postsService.createNewPosts(postBody, req.params.blogId, user._id.toString())
        if (!newPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUS.CREATED_201).send(newPost)
    }

    async createNewBlog(req: Request, res: Response) {
        const blog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }
        const newBlog = await this.blogsService.createNewBlogs(blog)
        res.status(HTTP_STATUS.CREATED_201).send(newBlog)
    }

    async updateBlogByBlogId(req: Request, res: Response) {
        const result = await this.blogsService.updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }
    }

    async deleteBlogById(req: Request, res: Response) {
        const deleted = await this.blogsService.deleteBlogsById(req.params.id)

        if (!deleted) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }
}