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
import {BlogsOutputModel} from "../../types/blogs-type";


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
blogsRouter.get('/:id/posts',//TODO : не зыбыть
    async (req: Request, res: Response) => {
        const filter = queryFilter(req.query);
        const result = await postsRepository.getPostInBlogs(req.params.id, filter)
        if(!result) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return res.send(result)
    })
blogsRouter.post('/:blogId/posts',//TODO : не зыбыть
    authGuardMiddleware,
    PostspParamsValidation(),
    ErrorMiddleware,
    async (req: Request, res: Response) => {

        const postBody = {
            title : req.body.title,
            shortDescription : req.body.shortDescription,
            content : req.body.content,
        }
        const newPost = await postsService.createNewPosts(postBody, req.params.blogId)
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
        const blog = {
            name:req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }
        const newBlog = await blogsService.createNewBlogs(blog)
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

