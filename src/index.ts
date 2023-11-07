import express from 'express'
import {VideoRouter} from "./routers/videos/video-router";
import {AllDataClear} from "./routers/all-data-clear";
import {runDB} from "./DB/data-base";
import {userRouter} from "./routers/user&auth/User-router";
import {authRouter} from "./routers/user&auth/auth-router";
import {blogsRouter} from "./routers/blogs&posts&comments/blogs-router";
import {postsRouter} from "./routers/blogs&posts&comments/posts-router";
import {commentsRouter} from "./routers/blogs&posts&comments/comments-router";


export const app = express()
export const port = process.env.PORT || 3000

console.log(port)

export const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    Forbidden_403: 403,
    NOT_FOUND_404: 404
}

app.use(express.json());
app.use("/videos", VideoRouter)
app.use("/testing/all-data", AllDataClear)
app.use("/blogs", blogsRouter)
app.use("/posts", postsRouter)
app.use("/users", userRouter)
app.use("/auth", authRouter)
app.use("/comments", commentsRouter)



const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
startApp()