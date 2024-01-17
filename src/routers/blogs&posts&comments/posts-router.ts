import {Router} from "express";
import {PostsValidation} from "../../middleware/input-middleware/posts-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";
import {CommentValidation, LikeStatusValidation} from "../../middleware/input-middleware/comment-validation";
import {commentsRouter} from "./comments-router";
import {PostsController} from "../../contoller/post-controller";
import {container} from "../../composition-root/composition-root";


export const postsRouter = Router()

const postsController = container.resolve<PostsController>(PostsController)


postsRouter.get('/',authMiddleware, postsController.getAllPostsInDB.bind(postsController))
postsRouter.get('/:id', postsController.getPostByPostId.bind(postsController))
postsRouter.get("/:postId/comments", authMiddlewareForGetCommentById, postsController.getCommentByCommendIdInPosts.bind(postsController))
postsRouter.post("/:postId/comments", authMiddleware, CommentValidation(), ErrorMiddleware, postsController.createCommentsInPostById.bind(postsController))
postsRouter.post('/', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsController.createNewPost.bind(postsController))
postsRouter.put('/:id', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsController.updatePostByPostId.bind(postsController))
commentsRouter.put("/:postId/like-status", authMiddleware, LikeStatusValidation(), ErrorMiddleware, postsController.appropriationLike.bind(postsController))
postsRouter.delete('/:id', authGuardMiddleware, postsController.deletePostByPostId.bind(postsController))

