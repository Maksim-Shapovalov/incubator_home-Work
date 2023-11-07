export type CommentsTypeDb = {
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    postId: string,
    "createdAt": string
}

export type CommentsOutputType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    "createdAt": string
}