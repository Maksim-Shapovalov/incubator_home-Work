import {Request, Response, Router} from "express";
import {HTTP_STATUS} from "../../index";
import {ServicePosts} from "../../service-rep/service-posts";
import {PostsValidation} from "../../middleware/input-middleware/posts-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {queryFilter} from "../../repository/qurey-repo/query-filter";
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";
import {CommentValidation} from "../../middleware/input-middleware/comment-validation";
import {PostsRepository} from "../../repository/posts-repository";
import {CommentsRepository} from "../../repository/comments-repository";
import {ServiceComments} from "../../service-rep/service-comments";

export const postsRouter = Router()


class PostsController {
    private postsService: ServicePosts;
    private postsRepository: PostsRepository;
    private commentsRepository: CommentsRepository;
    private serviceComments: ServiceComments;
    constructor() {
        this.postsService = new ServicePosts()
        this.postsRepository = new PostsRepository()
        this.serviceComments = new ServiceComments()
        this.commentsRepository = new CommentsRepository()
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

    async deletePostByPostId(req: Request, res: Response) {
        const deleted = await this.postsService.deletePostsById(req.params.id)

        if (!deleted) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }

        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
    }
}

const postsControllerInstance = new PostsController()

postsRouter.get('/', postsControllerInstance.getAllPostsInDB.bind(postsControllerInstance))
postsRouter.get('/:id', postsControllerInstance.getPostByPostId.bind(postsControllerInstance))
postsRouter.get("/:postId/comments",authMiddlewareForGetCommentById, postsControllerInstance.getCommentByCommendIdInPosts.bind(postsControllerInstance))
postsRouter.post("/:postId/comments", authMiddleware, CommentValidation(), ErrorMiddleware, postsControllerInstance.createCommentsInPostById.bind(postsControllerInstance))
postsRouter.post('/', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsControllerInstance.createNewPost.bind(postsControllerInstance))
postsRouter.put('/:id', authGuardMiddleware, PostsValidation(), ErrorMiddleware, postsControllerInstance.updatePostByPostId.bind(postsControllerInstance))
postsRouter.delete('/:id', authGuardMiddleware, postsControllerInstance.deletePostByPostId.bind(postsControllerInstance))

