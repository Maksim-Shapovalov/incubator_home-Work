import {BlogsRepository} from "../repository/blogs-repository";
import {ServiceBlogs} from "../service-rep/service-blogs";
import {PostsRepository} from "../repository/posts-repository";
import {ServicePosts} from "../service-rep/service-posts";
import {BlogController} from "../routers/blogs&posts&comments/blogs-router";

const blogRepository = new BlogsRepository()
const blogService = new ServiceBlogs(blogRepository)
const postRepository = new PostsRepository(blogRepository)
const postService = new ServicePosts(postRepository,blogRepository)

export const blogController = new BlogController(postService,blogService,blogRepository,postRepository)