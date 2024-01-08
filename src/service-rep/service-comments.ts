import {commentsMapper, CommentsRepository} from "../repository/comments-repository";
import {CommentsClass, CommentsOutputType} from "../types/comment-type";
import {WithId} from "mongodb";
import {UserMongoDbType} from "../types/user-type";
import {PostsRepository} from "../repository/posts-repository";



export class ServiceComments {
    constructor(
        protected commentsRepository:CommentsRepository,
        protected postsRepository: PostsRepository
    ) {

    }
    async createdNewComments(postId: string, content: string, user: WithId<UserMongoDbType>): Promise<CommentsOutputType | null> {
        const post = await this.postsRepository.getPostsById(postId);

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


        const res = await this.commentsRepository.saveComments(newComment)
        return commentsMapper(res, user._id.toString())

    }

    async updateComment(commentId: string, content: string) {
        return await this.commentsRepository.updateCommentsByCommentId(commentId, content)
    }
    async updateStatusLikeInUser(commentId:string, userId: string, status:string){
        return this.commentsRepository.updateStatusLikeUser(commentId, userId, status)
    }

    async deletedComment(commentId: string) {
        return await this.commentsRepository.deleteCommentsByCommentId(commentId)
    }

}
