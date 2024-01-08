import {PostsRepository} from "../repository/posts-repository";
import {ServicePosts} from "../service-rep/service-posts";
import {BlogsRepository} from "../repository/blogs-repository";
import {CommentsRepository} from "../repository/comments-repository";
import {ServiceComments} from "../service-rep/service-comments";
import {PostsController} from "../routers/blogs&posts&comments/posts-router";

const blogRepository = new BlogsRepository()
const postRepository = new PostsRepository(blogRepository)
const postService = new ServicePosts(postRepository,blogRepository)
const commentsRepository = new CommentsRepository(postRepository)
const commentsService = new ServiceComments(commentsRepository,postRepository)
export const postsController = new PostsController(postService,postRepository,commentsService,commentsRepository)