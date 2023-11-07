import {commentsRepository} from "../repository/comments-repository";
import {CommentsOutputType, CommentsTypeDb} from "../types/comment-type";
import {WithId} from "mongodb";
import {UserDbType} from "../types/user-type";
import {postsRepository} from "../repository/posts-repository";

export const serviceComments = {
    async createdNewComments (postId:string, content:string, user: WithId<UserDbType>): Promise<CommentsOutputType | null>{
        const post = await postsRepository.getPostsById(postId);

        if(!post){
            return null;
        }

        const newComment: CommentsTypeDb = {
            content: content,
            commentatorInfo: {
                userId: user._id.toString(),
                userLogin: user.login
            },
            postId: postId,
            createdAt: new Date().toISOString()
        }
        const res = await commentsRepository.createdNewComments(newComment)
        console.log(res)
        return res
    },
    async updateComment (commentId: string, content: string) {
        return await commentsRepository.updateCommentsByCommentId(commentId, content)
    },
    async deletedComment (commentId: string) {
        return await commentsRepository.deleteCommentsByCommentId(commentId)
    }

}