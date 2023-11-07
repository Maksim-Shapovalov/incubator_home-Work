import {Request, Response, Router} from "express";
import {blogsService} from "../../service-rep/service-blogs";
import {HTTP_STATUS} from "../../index";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {BlogsValidation} from "../../middleware/input-middleware/blogs-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {blogsRepository} from "../../repository/blogs-repository";
import {postsRepository} from "../../repository/posts-repository";
import {queryFilter, searchNameInBlog} from "../../repository/qurey-repo/query-filter";
import {postsService} from "../../service-rep/service-posts";
import { PostspParamsValidation} from "../../repository/qurey-repo/query-posts-repository";


export const blogsRouter = Router()

blogsRouter.get('/',
    async (req: Request, res: Response) => {
        const filter = searchNameInBlog(req.query);
        const allBlogs = await blogsRepository.getAllBlogs(filter);
        res.status(HTTP_STATUS.OK_200).send(allBlogs)
    })
blogsRouter.get('/:id',
    async (req: Request, res: Response) => {
        const blog = await blogsRepository.getBlogsById(req.params.id)
        if (blog) {
            res.status(HTTP_STATUS.OK_200).send(blog)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
    })
blogsRouter.get('/:id/posts',
    async (req: Request, res: Response) => {
        const filter = queryFilter(req.query);
        const result = await postsRepository.getPostInBlogs(req.params.id, filter)
        if(!result) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return res.send(result)
    })
blogsRouter.post('/:blogId/posts',
    authGuardMiddleware,
    PostspParamsValidation(),
    ErrorMiddleware,
    async (req: Request, res: Response) => {
        const {title, shortDescription, content} = req.body
        const newPost = await postsService.createNewPosts(title, shortDescription, content, req.params.blogId)
        if (!newPost) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUS.CREATED_201).send(newPost)
    })
blogsRouter.post('/',
    authGuardMiddleware,
    BlogsValidation(),
    ErrorMiddleware,
    async (req: Request, res: Response) => {
        const newBlog = await blogsService.createNewBlogs(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(HTTP_STATUS.CREATED_201).send(newBlog)
    })
blogsRouter.put('/:id',
    authGuardMiddleware,
    BlogsValidation(),
    ErrorMiddleware,
    async (req: Request, res: Response) => {
        const result = await blogsService.updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        } else {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        }

    })

blogsRouter.delete('/:id',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
        const deleted = await blogsService.deleteBlogsById(req.params.id)

        if (!deleted) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

