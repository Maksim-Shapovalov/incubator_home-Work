import {WithId} from "mongodb";

export class PostClass {
    constructor(
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string) {
    }
}


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
    title: string,
    shortDescription: string,
    content: string,
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