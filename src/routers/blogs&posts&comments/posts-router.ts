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
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";
import {CommentValidation} from "../../middleware/input-middleware/comment-validation";

export const postsRouter = Router()


class PostsController {
    async getAllPostsInDB(req: Request, res: Response) {
        const filter = queryFilter(req.query);
        const allPosts = await postsRepository.getAllPosts(filter);
        res.status(HTTP_STATUS.OK_200).send(allPosts)
    }

    async getPostByPostId(req: Request, res: Response) {
        let post = await postsRepository.getPostsById(req.params.id)
        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async getCommentByCommendIdInPosts(req: Request, res: Response) {
        const filter = queryFilter(req.query)
        const user = req.body.user
        const result = await commentsRepository.getCommentsInPost(req.params.postId, filter, user.id)
        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUS.OK_200).send(result)
    }

    async createCommentsInPostById(req: Request, res: Response) {
        const result = await serviceComments.createdNewComments(req.params.postId, req.body.content, req.body.user)

        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUS.CREATED_201).send(result)
    }

    async createNewPost(req: Request, res: Response) {
        const postBody = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        }
        const newBlogs = await postsService.createNewPosts(postBody, req.body.blogId)
        res.status(HTTP_STATUS.CREATED_201).send(newBlogs)
    }

    async updatePostByPostId(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body
        const result = await postsService.updatePostsById(req.params.id, title, shortDescription, content, blogId)
        if (result) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
    }

    async deletePostByPostId(req: Request, res: Response) {
        const deleted = await postsService.deletePostsById(req.params.id)

        if (!deleted) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }
}

const postsControllerInstance = new PostsController()

postsRouter.get('/', postsControllerInstance.getAllPostsInDB)
postsRouter.get('/:id', postsControllerInstance.getPostByPostId)
postsRouter.get("/:postId/comments",authMiddlewareForGetCommentById, postsControllerInstance.getCommentByCommendIdInPosts)
postsRouter.post("/:postId/comments", authMiddleware, CommentValidation(), ErrorMiddleware, postsControllerInstance.createCommentsInPostById)
postsRouter.post('/', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsControllerInstance.createNewPost)
postsRouter.put('/:id', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsControllerInstance.updatePostByPostId)
postsRouter.delete('/:id', authGuardMiddleware, postsControllerInstance.deletePostByPostId)

