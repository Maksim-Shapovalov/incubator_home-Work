import express from "express";
import cookieParser from "cookie-parser";
import {VideoRouter} from "./routers/videos/video-router";
import {AllDataClear} from "./routers/all-data-clear";
import {blogsRouter} from "./routers/blogs&posts&comments/blogs-router";
import {postsRouter} from "./routers/blogs&posts&comments/posts-router";
import {userRouter} from "./routers/user&auth/User-router";
import {authRouter} from "./routers/user&auth/auth-router";
import {commentsRouter} from "./routers/blogs&posts&comments/comments-router";
import {securityDevices} from "./routers/security-deviced/security-devices";
import {AllDataVideoClear} from "./db-items/db-videos";


    export const app = express()

    app.set('trust proxy', true)
    app.use(express.json());
    app.use(cookieParser())

    app.use("/videos", VideoRouter)
    app.use("/testing/all-data", AllDataClear)
    app.use("/blogs", blogsRouter)
    app.use("/posts", postsRouter)
    app.use("/users", userRouter)
    app.use("/auth", authRouter)
    app.use("/comments", commentsRouter)
    app.use("/security/devices", securityDevices)
    app.use("/AllDataVideoClear", AllDataVideoClear)
