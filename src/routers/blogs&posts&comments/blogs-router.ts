import {Router} from "express";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {BlogsValidation} from "../../middleware/input-middleware/blogs-validation";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {PostspParamsValidation} from "../../repository/qurey-repo/query-posts-repository";
import {container} from "../../composition-root/composition-root";
import {BlogController} from "../../contoller/blog-controller";
import {authMiddleware, authMiddlewareForGetCommentById} from "../../middleware/auth-middleware";



export const blogsRouter = Router()

const blogController = container.resolve<BlogController>(BlogController)

blogsRouter.get('/', blogController.getAllBlogs.bind(blogController))
blogsRouter.get('/:id', blogController.getBlogById.bind(blogController))
blogsRouter.get('/:id/posts', authMiddlewareForGetCommentById,blogController.getPostsByBlogId.bind(blogController))
blogsRouter.post('/:blogId/posts', authMiddlewareForGetCommentById,
    PostspParamsValidation(), ErrorMiddleware, blogController.createPostInBlogByBlogId.bind(blogController))
blogsRouter.post('/', authGuardMiddleware,
    BlogsValidation(), ErrorMiddleware, blogController.createNewBlog.bind(blogController))
blogsRouter.put('/:id', authGuardMiddleware,
    BlogsValidation(), ErrorMiddleware, blogController.updateBlogByBlogId.bind(blogController))
blogsRouter.delete('/:id',
    authGuardMiddleware, blogController.deleteBlogById.bind(blogController))

