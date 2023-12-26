import {commentsMapper, commentsRepository} from "../repository/comments-repository";
import {CommentsClass, CommentsOutputType} from "../types/comment-type";
import {WithId} from "mongodb";
import {UserMongoDbType} from "../types/user-type";
import {postsRepository} from "../repository/posts-repository";
import {CommentsModelClass} from "../schemas/comments-schemas";

export class ServiceComments {
    async createdNewComments(postId: string, content: string, user: WithId<UserMongoDbType>): Promise<CommentsOutputType | null> {
        const post = await postsRepository.getPostsById(postId);

        if (!post) {
            return null;
        }

        const newComment = new CommentsClass(
            content,
            {
                userId: user._id.toString(),
                userLogin: user.login
            },
            postId,
            new Date().toISOString()
        )


        const res = await commentsRepository.saveComments(newComment)
        const correctComment = commentsMapper(res)
        return correctComment
    }

    async updateComment(commentId: string, content: string) {
        return await commentsRepository.updateCommentsByCommentId(commentId, content)
    }

    async deletedComment(commentId: string) {
        return await commentsRepository.deleteCommentsByCommentId(commentId)
    }
}

export const serviceComments = new ServiceComments()