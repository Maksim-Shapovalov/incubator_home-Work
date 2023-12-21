import {Request, Response, Router} from "express";
import {HTTP_STATUS} from "../../index";
import {postsService} from "../../service-rep/service-posts";
import {PostsValidation} from "../../middleware/input-middleware/posts-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {queryFilter} from "../../repository/qurey-repo/query-filter";
import {postsRepository} from "../../repository/posts-repository";
import {commentsRepository} from "../../repository/comments-repository";
import {serviceComments} from "../../service-rep/service-comments";
import {authMiddleware} from "../../middleware/auth-middleware";
import {CommentValidation} from "../../middleware/input-middleware/comment-validation";

export const postsRouter = Router()
postsRouter.get('/', async (req:Request, res: Response) =>{
    const filter = queryFilter(req.query);
    const allPosts = await postsRepository.getAllPosts(filter);
    res.status(HTTP_STATUS.OK_200).send(allPosts)
})
postsRouter.get('/:id', async (req:Request, res: Response) =>{
    let post = await postsRepository.getPostsById(req.params.id)
    if (post){
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})
postsRouter.get("/:postId/comments",
    async (req:Request, res: Response)=> {
    const filter = queryFilter(req.query)
    const result = await commentsRepository.getCommentsInPost(req.params.postId ,filter)
    if (!result){
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
    }
    res.status(HTTP_STATUS.OK_200).send(result)
})
postsRouter.post("/:postId/comments",
    authMiddleware,
    CommentValidation(),
    ErrorMiddleware,
    async (req:Request, res: Response) => {
    const result = await serviceComments.createdNewComments(req.params.postId, req.body.content, req.body.user)

    if(!result){
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
    }

    res.status(HTTP_STATUS.CREATED_201).send(result)
})
postsRouter.post('/',
    authGuardMiddleware,
    PostsValidation(),
    ErrorMiddleware,
    async (req:Request, res: Response) =>{
    // const {title, shortDescription, content, blogId} = req.body
        const postBody = {
            title : req.body.title,
            shortDescription : req.body.shortDescription,
            content : req.body.content,
        }
    const newBlogs = await postsService.createNewPosts(postBody,req.body.blogId)
    res.status(HTTP_STATUS.CREATED_201).send(newBlogs)
})
postsRouter.put('/:id',
    authGuardMiddleware,
    PostsValidation(),
    ErrorMiddleware,
    async (req: Request, res: Response) => {
        const {title, shortDescription, content, blogId} = req.body
        const result = await postsService.updatePostsById(req.params.id, title, shortDescription, content, blogId)
        if (result) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
    })
postsRouter.delete('/:id',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
        const deleted = await postsService.deletePostsById(req.params.id)

        if (!deleted) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    })

