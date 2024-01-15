import {Router} from "express";
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";
import {CommentValidation, LikeStatusValidation} from "../../middleware/input-middleware/comment-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {container} from "../../composition-root/composition-root";
import {CommentsController} from "../../contoller/comment-controller";

export const commentsRouter = Router();

const commentsController = container.resolve<CommentsController>(CommentsController)

commentsRouter.get("/:id", authMiddlewareForGetCommentById, commentsController.getCommentsById.bind(commentsController))
commentsRouter.put("/:commentId", authMiddleware, CommentValidation(), ErrorMiddleware, commentsController.updateCommentByCommentId.bind(commentsController))
commentsRouter.put("/:commentId/like-status", authMiddleware, LikeStatusValidation(), ErrorMiddleware, commentsController.appropriationLike.bind(commentsController))
commentsRouter.delete("/:commentId", authMiddleware, commentsController.deleteCommentByCommentId.bind(commentsController))

