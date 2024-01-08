import {CommentsRepository} from "../repository/comments-repository";
import {ServiceComments} from "../service-rep/service-comments";
import {BlogsRepository} from "../repository/blogs-repository";
import {PostsRepository} from "../repository/posts-repository";
import {CommentsController} from "../routers/blogs&posts&comments/comments-router";

const commentsRepository = new CommentsRepository()
const blogRepository = new BlogsRepository()
const postRepository = new PostsRepository(blogRepository)
const commentsService = new ServiceComments(commentsRepository,postRepository)

export const commentsController = new CommentsController(commentsService,postRepository,commentsRepository)