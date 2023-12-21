import {WithId} from "mongodb";

export type BlogsOutputModel = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogRequest = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogsType = WithId<{
    // _id:
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>