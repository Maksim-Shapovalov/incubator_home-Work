import {Request, Response, Router} from "express";
import {HTTP_STATUS} from "../../index";
import {ServicePosts} from "../../service-rep/service-posts";
import {PostsValidation} from "../../middleware/input-middleware/posts-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {queryFilter} from "../../repository/qurey-repo/query-filter";
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";
import {CommentValidation, LikeStatusValidation} from "../../middleware/input-middleware/comment-validation";
import {PostsRepository} from "../../repository/posts-repository";
import {CommentsRepository} from "../../repository/comments-repository";
import {ServiceComments} from "../../service-rep/service-comments";
import {postsController} from "../../composition-root/composition-root-post";
import {commentsController} from "../../composition-root/composition-root-comment";
import {commentsRouter} from "./comments-router";

export const postsRouter = Router()


export class PostsController {


    constructor(
        protected postsService: ServicePosts,
        protected postsRepository: PostsRepository,
        protected serviceComments: ServiceComments,
        protected commentsRepository: CommentsRepository
    ) {

    }

    async getAllPostsInDB(req: Request, res: Response) {
        const filter = queryFilter(req.query);
        const allPosts = await this.postsRepository.getAllPosts(filter);
        res.status(HTTP_STATUS.OK_200).send(allPosts)
    }

    async getPostByPostId(req: Request, res: Response) {
        let post = await this.postsRepository.getPostsById(req.params.id)
        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async getCommentByCommendIdInPosts(req: Request, res: Response) {
        const filter = queryFilter(req.query)
        const user = req.body.user
        const result = await this.commentsRepository.getCommentsInPost(req.params.postId, filter, user._id.toString())
        if (!result) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUS.OK_200).send(result)
    }

    async createCommentsInPostById(req: Request, res: Response) {
        const result = await this.serviceComments.createdNewComments(req.params.postId, req.body.content, req.body.user)

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
        const newBlogs = await this.postsService.createNewPosts(postBody, req.body.blogId)
        res.status(HTTP_STATUS.CREATED_201).send(newBlogs)
    }

    async updatePostByPostId(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body
        const result = await this.postsService.updatePostsById(req.params.id, title, shortDescription, content, blogId)
        if (result) {
            res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
        } else {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        }
    }
    async appropriationLike(req: Request, res: Response) {
        const value = req.body.user

        const updateComment = await this.postsService.updateStatusLikeInUser(req.params.commentId, value._id.toString(), req.body.likeStatus)

        if (!updateComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async deletePostByPostId(req: Request, res: Response) {
        const deleted = await this.postsService.deletePostsById(req.params.id)

        if (!deleted) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }
}


postsRouter.get('/', postsController.getAllPostsInDB.bind(postsController))
postsRouter.get('/:id', postsController.getPostByPostId.bind(postsController))
postsRouter.get("/:postId/comments", authMiddlewareForGetCommentById, postsController.getCommentByCommendIdInPosts.bind(postsController))
postsRouter.post("/:postId/comments", authMiddleware, CommentValidation(), ErrorMiddleware, postsController.createCommentsInPostById.bind(postsController))
postsRouter.post('/', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsController.createNewPost.bind(postsController))
postsRouter.put('/:id', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsController.updatePostByPostId.bind(postsController))
commentsRouter.put("/:commentId/like-status", authMiddleware, LikeStatusValidation(), ErrorMiddleware, postsController.appropriationLike.bind(postsController))
postsRouter.delete('/:id', authGuardMiddleware, postsController.deletePostByPostId.bind(postsController))

