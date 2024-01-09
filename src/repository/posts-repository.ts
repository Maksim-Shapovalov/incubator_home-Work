import {PostClass, PostOutputModel, PostsType} from "../types/posts-type";
import {ObjectId, WithId} from "mongodb";
import {PaginationQueryType, PaginationType} from "./qurey-repo/query-filter";
import {PostModelClass} from "../schemas/post-schema";
import {BlogsRepository} from "./blogs-repository";
import {LikesModelClass} from "../schemas/comments-schemas";


export class PostsRepository {
    constructor(protected blogsRepository: BlogsRepository) {
    }
    async getAllPosts(filter: PaginationQueryType): Promise<PaginationType<PostOutputModel>> {
        const pageSizeInQuery: number = filter.pageSize;
        const totalCountBlogs = await PostModelClass.countDocuments({})

        const pageCountBlogs: number = Math.ceil(totalCountBlogs / pageSizeInQuery)
        const pageBlog: number = ((filter.pageNumber - 1) * pageSizeInQuery)
        const result = await PostModelClass
            .find({})
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageBlog)
            .limit(pageSizeInQuery)
            .lean()
        const items = result.map((p) => postMapper(p))
        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }
    }

    async getPostsById(id: string): Promise<PostOutputModel | null> {
        const findPosts = await PostModelClass
            .findOne({_id: new ObjectId(id)});

        if (!findPosts) {
            return null
        }
        return postMapper(findPosts)
    }

    async getPostInBlogs(blogId: string, filter: PaginationQueryType): Promise<PaginationType<PostOutputModel> | null> {
        const findBlog = await this.blogsRepository.getBlogsById(blogId)
        if (!findBlog) {
            return null
        }

        const filterQuery = {blogId: findBlog.id}


        const pageSizeInQuery: number = filter.pageSize;
        const totalCountBlogs = await PostModelClass.countDocuments(filterQuery)

        const pageCountBlogs: number = Math.ceil(totalCountBlogs / pageSizeInQuery)
        const pageBlog: number = ((filter.pageNumber - 1) * pageSizeInQuery)

        const res = await PostModelClass
            .find(filterQuery)
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageBlog)
            .limit(pageSizeInQuery)
            .lean()
        const items = res.map((p) => postMapper(p))
        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }

    }
    async updateStatusLikeUser(commentId: string, userId: string, status: string) {
        const likeWithUserId = await LikesModelClass.findOne({userId, commentId}).exec()

        const comment = await PostModelClass.findOne({_id: new ObjectId((commentId))}).exec()

        if (!comment) {
            return false
        }

        if (likeWithUserId) {
            const updateStatus = await LikesModelClass.updateOne({commentId, userId}, {
                $set: {
                    likeStatus: status,
                }
            })

            return updateStatus.matchedCount === 1
        }

        await LikesModelClass.create({commentId, userId, likeStatus: status})

        return true
    }

    async savePost(post: PostClass): Promise<PostsType> {
        return PostModelClass.create(post)
    }

    async updatePostsById(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const res = await PostModelClass.updateOne({_id: new ObjectId(id)}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        })
        return res.matchedCount === 1
    }

    async deletePostsById(id: string): Promise<boolean> {
        const findPost = await PostModelClass.deleteOne({_id: new ObjectId(id)})
        return findPost.deletedCount === 1

    }
}


export const postMapper = (post: WithId<PostsType>): PostOutputModel => {
    return {
        id: post._id.toHexString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}