import {Request, Response, Router} from "express";
import {HTTP_STATUS} from "../../index";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {BlogsValidation} from "../../middleware/input-middleware/blogs-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {queryFilter, searchNameInBlog} from "../../repository/qurey-repo/query-filter";
import {PostspParamsValidation} from "../../repository/qurey-repo/query-posts-repository";
import {ServiceBlogs} from "../../service-rep/service-blogs";
import {BlogsRepository} from "../../repository/blogs-repository";
import {ServicePosts} from "../../service-rep/service-posts";
import {PostsRepository} from "../../repository/posts-repository";
import {blogController} from "../../composition-root/composition-root-blog";


export const blogsRouter = Router()

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
        const filter = queryFilter(req.query);
        const result = await this.postsRepository.getPostInBlogs(req.params.id, filter)
        if (!result) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return res.send(result)
    }

    async createPostInBlogByBlogId(req: Request, res: Response) {

        const postBody = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        }
        const newPost = await this.postsService.createNewPosts(postBody, req.params.blogId)
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

blogsRouter.get('/', blogController.getAllBlogs.bind(blogController))
blogsRouter.get('/:id', blogController.getBlogById.bind(blogController))
blogsRouter.get('/:id/posts', blogController.getPostsByBlogId.bind(blogController))
blogsRouter.post('/:blogId/posts', authGuardMiddleware,
    PostspParamsValidation(), ErrorMiddleware, blogController.createPostInBlogByBlogId.bind(blogController))
blogsRouter.post('/', authGuardMiddleware,
    BlogsValidation(), ErrorMiddleware, blogController.createNewBlog.bind(blogController))
blogsRouter.put('/:id', authGuardMiddleware,
    BlogsValidation(), ErrorMiddleware, blogController.updateBlogByBlogId.bind(blogController))
blogsRouter.delete('/:id',
    authGuardMiddleware, blogController.deleteBlogById.bind(blogController))

