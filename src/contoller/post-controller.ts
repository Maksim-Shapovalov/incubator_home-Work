import "reflect-metadata"
import {injectable} from "inversify";
import {ServicePosts} from "../service-rep/service-posts";
import {PostsRepository} from "../repository/posts-repository";
import {ServiceComments} from "../service-rep/service-comments";
import {CommentsRepository} from "../repository/comments-repository";
import {Request, Response} from "express";
import {queryFilter} from "../repository/qurey-repo/query-filter";
import {HTTP_STATUS} from "../index";

@injectable()
export class PostsController {


    constructor(
        protected postsService: ServicePosts,
        protected postsRepository: PostsRepository,
        protected serviceComments: ServiceComments,
        protected commentsRepository: CommentsRepository
    ) {

    }

    async getAllPostsInDB(req: Request, res: Response) {
        const user = req.body.user
        if (!user){
            const filter = queryFilter(req.query);
            const allPosts = await this.postsRepository.getAllPosts(filter, null);
            return res.status(HTTP_STATUS.OK_200).send(allPosts)
        }
        const filter = queryFilter(req.query);
        const allPosts = await this.postsRepository.getAllPosts(filter, user._id);
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
        const user = req.body.user
        const postBody = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
        }
        const newBlogs = await this.postsService.createNewPosts(postBody, req.body.blogId, user)
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

        const updateComment = await this.postsService.updateStatusLikeInUser(req.params.postId, value, req.body.likeStatus)

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