import {commentsMapper, commentsRepository} from "../repository/comments-repository";
import {CommentsOutputType, CommentsTypeDb} from "../types/comment-type";
import {WithId} from "mongodb";
import {UserMongoDbType} from "../types/user-type";
import {postsRepository} from "../repository/posts-repository";
import {CommentsModelClass} from "../schemas/comments-schemas";

export const serviceComments = {
    async createdNewComments (postId:string, content:string, user: WithId<UserMongoDbType>): Promise<CommentsOutputType | null>{
        const post = await postsRepository.getPostsById(postId);

        if(!post){
            return null;
        }

        const newComment = new CommentsModelClass()
        newComment.content = content,
        newComment.commentatorInfo = {
            userId: user._id.toString(),
            userLogin: user.login
        },
        newComment.postId = postId,
        newComment.createdAt = new Date().toISOString()


        // const newComment: CommentsTypeDb = {
        //     content: content,
        //     commentatorInfo: {
        //         userId: user._id.toString(),
        //         userLogin: user.login
        //     },
        //     postId: postId,
        //     createdAt: new Date().toISOString()
        // }
        const res = await commentsRepository.saveComments(newComment)
        const correctComment = commentsMapper(res)
        return correctComment
    },
    async updateComment (commentId: string, content: string) {
        return await commentsRepository.updateCommentsByCommentId(commentId, content)
    },
    async deletedComment (commentId: string) {
        return await commentsRepository.deleteCommentsByCommentId(commentId)
    }

}