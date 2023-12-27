import {WithId} from "mongodb";

export class CommentsClass {
     constructor(
    public content: string,
    public commentatorInfo: {
        userId: string
        userLogin: string
    },
    public postId: string,
    public createdAt: string,
    public likeStatus: AvailableStatusEnum) {
    }

}

export type CommentsTypeDb = WithId<{
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    postId: string
    createdAt: string
    likeStatus: string
}>

export enum AvailableStatusEnum {
    like = "like",
    none = 'none',
    dislike = 'dislike'
}

export type CommentsOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    "createdAt": string
    likesInfo:{
        likesCount: number,
        dislikesCount: number,
        myStatus: string
    }
}