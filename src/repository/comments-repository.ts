import { dataComments} from "../DB/data-base";
import {ObjectId, WithId} from "mongodb";
import {CommentsOutputType, CommentsTypeDb} from "../types/comment-type";
import {PaginationQueryType, PaginationType} from "./qurey-repo/query-filter";
import {postsRepository} from "./posts-repository";



export const commentsRepository = {
    async getCommentsInPost(postId: string, filter: PaginationQueryType): Promise<PaginationType<CommentsOutputType> | null> {
        const findPost = await postsRepository.getPostsById(postId)

        if (!findPost){
            return null
        }

        const filterQuery = { postId: findPost.id }

        const pageSizeInQuery: number = filter.pageSize;
        const totalCountBlogs = await dataComments.countDocuments(filterQuery)

        const pageCountBlogs: number = Math.ceil(totalCountBlogs / pageSizeInQuery)
        const pageComment: number = ((filter.pageNumber - 1) * pageSizeInQuery)

        const res = await dataComments
            .find(filterQuery)
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageComment)
            .limit(pageSizeInQuery)
            .toArray()

        const items = res.map((c) => commentsMapper(c))

        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }
    },
    async createdNewComments (newComment: CommentsTypeDb): Promise<CommentsOutputType | null>{
        const res = await dataComments.insertOne({...newComment})

        if(!res || !res?.insertedId){
            return null;
        }

        return commentsMapper({...newComment, _id: res.insertedId})
    },
    async getCommentById (commentId:string): Promise<CommentsOutputType | null> {
        if (!ObjectId.isValid(commentId)) return null
        const findComments = await dataComments.findOne({_id: new ObjectId(commentId)})
        if (!findComments){
            return null
        }
        return commentsMapper(findComments)
    },
    async updateCommentsByCommentId (commentId: string, content: string): Promise<boolean>{
        const updateComment = await dataComments.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                content
            }
        })
        return updateComment.matchedCount === 1
    },
    async deleteCommentsByCommentId (commentId: string): Promise<boolean> {
        const deletedComment = await dataComments.deleteOne({_id: new ObjectId(commentId)})
        return deletedComment.deletedCount === 1
    }
}

export const commentsMapper = (comment: WithId<CommentsTypeDb>):CommentsOutputType =>{
    return {
        id: comment._id.toHexString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt
    }
}