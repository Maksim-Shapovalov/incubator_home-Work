import {PostClass, PostLikesDB, PostOutputModel, PostsOutputType, PostsType} from "../types/posts-type";
import {ObjectId, WithId} from "mongodb";
import {PaginationQueryType, PaginationType} from "./qurey-repo/query-filter";
import {PostLikesModelClass, PostModelClass} from "../schemas/post-schema";
import {BlogsRepository} from "./blogs-repository";
import {LikesModelClass} from "../schemas/comments-schemas";
import {injectable} from "inversify";
import "reflect-metadata"
import {AvailableStatusEnum, CommentsOutputType, CommentsTypeDb} from "../types/comment-type";
import {UserModelClass} from "../schemas/user-schemas";
import {UserMongoDbType} from "../types/user-type";
@injectable()
export class PostsRepository {
    constructor(protected blogsRepository: BlogsRepository) {
    }
    async getAllPosts(filter: PaginationQueryType, userId: string | null): Promise<PaginationType<PostsOutputType>> {
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
        // const items = result.map((p) => postsLikeMapper(p,userId))
        const itemsPromises = result.map((p) => postsLikeMapper(p, userId));
        const items = await Promise.all(itemsPromises);
        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }
    }

    async getPostsById(id: string, userId: string | null): Promise<PostsOutputType | null> {
        const findPosts = await PostModelClass
            .findOne({_id: new ObjectId(id)});

        if (!findPosts) {
            return null
        }
        return postsLikeMapper(findPosts,userId)
    }

    async getPostInBlogs(blogId: string, filter: PaginationQueryType, userId: string | null): Promise<PaginationType<PostsOutputType> | null> {
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
        // const items = res.map((p) => postsLikeMapper(p,null))
        const itemsPromises = res.map((p) => postsLikeMapper(p, userId));
        const items = await Promise.all(itemsPromises);

        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }

    }
    async updateStatusLikeUser(postId: string, user:UserMongoDbType,  status: string) {
        const userId = user._id.toString()
        const likeWithUserId = await PostLikesModelClass.findOne({userId: userId, postId: postId}).exec()

        const comment = await PostModelClass.findOne({_id: new ObjectId((postId))}).exec()

        if (!comment) {
            return false
        }

        if (likeWithUserId) {
            const updateStatus = await PostLikesModelClass.updateOne({postId, userId}, {
                $set: {
                    likesStatus: status,
                }
            })

            return updateStatus.matchedCount === 1
        }
        // const findLoginUser = await UserModelClass.findOne({userId})
        // if (!findLoginUser){
        //     return false
        // }
        await PostLikesModelClass.create({postId, userId, likesStatus: status, createdAt: new Date().toISOString(), login:user.login })

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
export const postsLikeMapper = async (post: WithId<PostsType>, userId: string | null): Promise<PostsOutputType> => {
    const likeCount = await PostLikesModelClass.countDocuments({
        likesStatus: AvailableStatusEnum.like,
        commentId: post._id.toString()
    })
    const dislikeCount = await PostLikesModelClass.countDocuments({
        likesStatus: AvailableStatusEnum.dislike,
        commentId: post._id.toString()
    })


    const myStatus = await PostLikesModelClass.findOne({
        userId,
        postId: post._id.toString()
    }).exec()
    const findThreeLastUser = await PostLikesModelClass.find({likesStatus: {$all: ["Like"]}}).sort({createdAt: -1}).limit(3).exec()


    return {
        id: post._id.toHexString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: +likeCount,
            dislikesCount: +dislikeCount,
            myStatus: myStatus ? myStatus.likesStatus : 'None',
            newestLikes: findThreeLastUser.map(r => ({
                addedAt: r.createdAt,
                userId:r.userId,
                login: r.login})),
        }

    }
}

export const postMapper = async (post: WithId<PostsType>, userId: string | null): Promise<PostOutputModel> => {
    const likeCount = await PostLikesModelClass.countDocuments({
        likesStatus: AvailableStatusEnum.like,
        commentId: post._id.toString()
    })
    const dislikeCount = await PostLikesModelClass.countDocuments({
        likesStatus: AvailableStatusEnum.dislike,
        commentId: post._id.toString()
    })


    const myStatus = await PostLikesModelClass.findOne({
        userId,
        postId: post._id.toString()
    }).exec()
    const findThreeLastUser = await PostLikesModelClass.find({likesStatus: {$all: ["Like"]}}).sort({createdAt: -1}).limit(3).exec()
    return {
        id: post._id.toHexString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: +likeCount,
            dislikesCount: +dislikeCount,
            myStatus: myStatus ? myStatus.likesStatus : 'None',
            newestLikes: findThreeLastUser.map(r => ({
                addedAt: r.createdAt,
                userId:r.userId,
                login: r.login})),
        }
    }
}