import {WithId} from "mongodb";

export class CommentsClass {
     constructor(
    public content: string,
    public commentatorInfo: {
        userId: string
        userLogin: string
    },
    public postId: string,
    public createdAt: string) {
    }
}

export type CommentsTypeDb = WithId<{
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    postId: string,
    "createdAt": string
}>

export type CommentsOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    "createdAt": string
}