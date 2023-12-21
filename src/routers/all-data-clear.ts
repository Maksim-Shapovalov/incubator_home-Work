import {Request, Response, Router} from "express";
import { HTTP_STATUS} from "../index";
import {DataIDModelClass} from "../schemas/dataID-schemas";
import {UserModelClass} from "../schemas/user-schemas";
import {BlogModelClass} from "../schemas/blog-schemas";
import {PostModelClass} from "../schemas/post-schema";
import {CommentsModelClass} from "../schemas/comments-schemas";


export const AllDataClear = Router();

AllDataClear.delete('/', async(req:Request, res: Response) => {
   await Promise.all([
       PostModelClass.deleteMany({}),
       BlogModelClass.deleteMany({}),
       UserModelClass.deleteMany({}),
       CommentsModelClass.deleteMany({}),
       DataIDModelClass.deleteMany({})
   ])
   return res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
})