import {Router, Request, Response} from "express";
import {HTTP_STATUS} from "../../index";
import {ServiceComments} from "../../service-rep/service-comments";
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";
import {CommentValidation, LikeStatusValidation} from "../../middleware/input-middleware/comment-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {PostsRepository} from "../../repository/posts-repository";
import {CommentsRepository} from "../../repository/comments-repository";
import {commentsController} from "../../composition-root/composition-root-comment";

export const commentsRouter = Router();

export class CommentsController {
    constructor(
        protected serviceComments: ServiceComments,
        protected postsRepository: PostsRepository,
        protected commentsRepository: CommentsRepository,
    ) {
    }

    async getCommentsById(req: Request, res: Response) {
        const user = req.body.user
        if (!user) {
            const findComments = await this.commentsRepository.getCommentById(req.params.id, null)

            if (!findComments) {
                res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
                return

            }
            return res.status(HTTP_STATUS.OK_200).send(findComments)
        }
        const findComments = await this.commentsRepository.getCommentById(req.params.id, user._id)

        if (!findComments) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return

        }

        res.status(HTTP_STATUS.OK_200).send(findComments)
    }

    async updateCommentByCommentId(req: Request, res: Response) {
        const user = req.body.user
        const comment = await this.commentsRepository.getCommentById(req.params.commentId, null)

        if (comment?.commentatorInfo.userId != user._id.toString()) {
            res.sendStatus(HTTP_STATUS.Forbidden_403)
            return
        }

        const updateComment = await this.serviceComments.updateComment(req.params.commentId, req.body.content)

        if (!updateComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async appropriationLike(req: Request, res: Response) {
        const value = req.body.user

        const updateComment = await this.serviceComments.updateStatusLikeInUser(req.params.commentId, value._id.toString(), req.body.likeStatus)

        if (!updateComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

    async deleteCommentByCommentId(req: Request, res: Response) {
        const user = req.body.user
        const comment = await this.commentsRepository.getCommentById(req.params.commentId, user._id.toString())

        if (comment?.commentatorInfo.userId != user._id.toString()) {
            res.sendStatus(HTTP_STATUS.Forbidden_403)
            return
        }

        const deletedComment = await this.serviceComments.deletedComment(req.params.commentId)

        if (!deletedComment) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }

}

commentsRouter.get("/:id", authMiddlewareForGetCommentById, commentsController.getCommentsById.bind(commentsController))
commentsRouter.put("/:commentId", authMiddleware, CommentValidation(), ErrorMiddleware, commentsController.updateCommentByCommentId.bind(commentsController))
commentsRouter.put("/:commentId/like-status", authMiddleware, LikeStatusValidation(), ErrorMiddleware, commentsController.appropriationLike.bind(commentsController))
commentsRouter.delete("/:commentId", authMiddleware, commentsController.deleteCommentByCommentId.bind(commentsController))

