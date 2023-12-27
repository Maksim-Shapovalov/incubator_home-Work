import {ObjectId, WithId} from "mongodb";
import {AvailableStatusEnum, CommentsClass, CommentsOutputType, CommentsTypeDb} from "../types/comment-type";
import {PaginationQueryType, PaginationType} from "./qurey-repo/query-filter";
import {postsRepository} from "./posts-repository";
import {CommentsModelClass} from "../schemas/comments-schemas";

export class CommentsRepository {
    async getCommentsInPost(postId: string, filter: PaginationQueryType): Promise<PaginationType<CommentsOutputType> | null> {
        const findPost = await postsRepository.getPostsById(postId)

        if (!findPost) {
            return null
        }

        const filterQuery = {postId: findPost.id}

        const pageSizeInQuery: number = filter.pageSize;
        const totalCountBlogs = await CommentsModelClass.countDocuments(filterQuery)

        const pageCountBlogs: number = Math.ceil(totalCountBlogs / pageSizeInQuery)
        const pageComment: number = ((filter.pageNumber - 1) * pageSizeInQuery)

        const res = await CommentsModelClass
            .find(filterQuery)
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageComment)
            .limit(pageSizeInQuery)
            .lean()

        // const items = res.map((c) => commentsMapper(c))

        const itemsPromises = res.map((c) => commentsMapper(c))
        const items = await Promise.all(itemsPromises)

        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }
    }

    async saveComments(comments: CommentsClass): Promise<CommentsTypeDb> {
        return CommentsModelClass.create(comments)
    }

    async getCommentById(commentId: string): Promise<CommentsOutputType | null> {
        if (!ObjectId.isValid(commentId)) return null
        const findComments = await CommentsModelClass.findOne({_id: new ObjectId(commentId)})
        if (!findComments) {
            return null
        }
        return commentsMapper(findComments)
    }

    async updateCommentsByCommentId(commentId: string, content: string): Promise<boolean> {
        const updateComment = await CommentsModelClass.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                content
            }
        })
        return updateComment.matchedCount === 1
    }

    async updateStatusLikeUser(commentId: string, status: string) {
        const updateStatus = await CommentsModelClass.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                likeStatus: status
            }
        })
        return updateStatus.matchedCount === 1
    }

    async deleteCommentsByCommentId(commentId: string): Promise<boolean> {
        const deletedComment = await CommentsModelClass.deleteOne({_id: new ObjectId(commentId)})
        return deletedComment.deletedCount === 1
    }
}

export const commentsRepository = new CommentsRepository()
export const commentsMapper = async (comment: WithId<CommentsTypeDb>): Promise<CommentsOutputType> => {
    const likeCount = await CommentsModelClass.countDocuments({likeStatus: AvailableStatusEnum.like})
    const dislikeCount = await CommentsModelClass.countDocuments({likeStatus: AvailableStatusEnum.dislike})

    return {
        id: comment._id.toHexString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: +likeCount,
            dislikesCount: +dislikeCount,
            myStatus: "Like"
        }
    }
}
//,postId: comment.postId