import {WithId} from "mongodb";

export type PostOutputModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type BodyPostToRequest = {
    title : string,
    shortDescription : string,
    content : string,
}


export type PostsType = WithId<{
    // id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}>