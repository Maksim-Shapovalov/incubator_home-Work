import {commentsMapper, commentsRepository} from "../repository/comments-repository";
import {AvailableStatusEnum, CommentsClass, CommentsOutputType} from "../types/comment-type";
import {WithId} from "mongodb";
import {UserMongoDbType} from "../types/user-type";
import {postsRepository} from "../repository/posts-repository";


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
            new Date().toISOString(),
        )


        const res = await commentsRepository.saveComments(newComment)
        return commentsMapper(res)

    }

    async updateComment(commentId: string, content: string) {
        return await commentsRepository.updateCommentsByCommentId(commentId, content)
    }
    async updateStatusLikeInUser(commentId:string, userId: string, status:string){
        return commentsRepository.updateStatusLikeUser(commentId, userId, status)
    }

    async deletedComment(commentId: string) {
        return await commentsRepository.deleteCommentsByCommentId(commentId)
    }

}

export const serviceComments = new ServiceComments()