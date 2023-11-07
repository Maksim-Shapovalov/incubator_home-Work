import {PostOutputModel, PostsType} from "../types/posts-type";
import {dataBlog, dataPost} from "../DB/data-base";
import {ObjectId, WithId} from "mongodb";
import {blogMapper, blogsRepository} from "./blogs-repository";
import {PaginationQueryType, PaginationType} from "./qurey-repo/query-filter";

export const postsRepository = {
    async getAllPosts(filter:PaginationQueryType): Promise<PaginationType<PostOutputModel>>{
        const pageSizeInQuery: number = filter.pageSize;
        const totalCountBlogs = await dataPost.countDocuments({})

        const pageCountBlogs: number = Math.ceil(totalCountBlogs / pageSizeInQuery)
        const pageBlog: number = ((filter.pageNumber - 1) * pageSizeInQuery)
        const result = await dataPost
            .find({})
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageBlog)
            .limit(pageSizeInQuery)
            .toArray()
        const items = result.map((p) => postMapper(p))
        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }
    },
    async getPostsById(id: string):Promise<PostOutputModel | null> {
        const findPosts = await dataPost
            .findOne({_id: new ObjectId(id)});
        console.log(findPosts)
        if (!findPosts){
            return null
        }
        return postMapper(findPosts)
    },
    async getPostInBlogs(blogId: string, filter: PaginationQueryType): Promise<PaginationType<PostOutputModel> | null> {
        const findBlog = await blogsRepository.getBlogsById(blogId)
        if (!findBlog) {
            return null
        }

        const filterQuery = {blogId: findBlog.id}


        const pageSizeInQuery: number = filter.pageSize;
        const totalCountBlogs = await dataPost.countDocuments(filterQuery)

        const pageCountBlogs: number = Math.ceil(totalCountBlogs / pageSizeInQuery)
        const pageBlog: number = ((filter.pageNumber - 1) * pageSizeInQuery)

        const res = await dataPost
            .find(filterQuery)
            .sort({[filter.sortBy]: filter.sortDirection})
            .skip(pageBlog)
            .limit(pageSizeInQuery)
            .toArray()
        const items = res.map((p) => postMapper(p))
        return {
            pagesCount: pageCountBlogs,
            page: filter.pageNumber,
            pageSize: pageSizeInQuery,
            totalCount: totalCountBlogs,
            items: items
        }

    },
    async createNewPosts
    (newPosts: PostsType): Promise<PostOutputModel> {
        const result = await dataPost.insertOne({...newPosts})
        return postMapper({...newPosts, _id: result.insertedId})
    },
    async updatePostsById
    (id: string, title:string,shortDescription:string,content:string,blogId:string): Promise<boolean> {
        const res = await dataPost.updateOne({_id: new ObjectId(id)}, {$set: {title,shortDescription, content, blogId}})
        return res.matchedCount === 1
    },
    async deletePostsById(id: string): Promise<boolean>{
        const findPost = await dataPost.deleteOne({_id: new ObjectId(id)})
        return findPost.deletedCount === 1

    }

}

export const postMapper = (post: WithId<PostsType>): PostOutputModel => {
    return {
        id: post._id.toHexString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}