import {Response, Request, Router} from "express";
import {searchLogAndEmailInUsers} from "../../repository/qurey-repo/query-filter";
import {userRepository} from "../../repository/user-repository";
import {serviceUser} from "../../service-rep/service-user";
import {HTTP_STATUS} from "../../index";
import {UserValidation} from "../../middleware/input-middleware/user-validation";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {ErrorMiddleware} from "../../middleware/error-middleware";


export const userRouter = Router()

userRouter.get("/",
    authGuardMiddleware ,
    async (req: Request, res: Response) => {
    const filter = searchLogAndEmailInUsers(req.query)
    const result = await userRepository.getAllUsers(filter)
    console.log(result)
    res.send(result)
})
userRouter.get("/:codeId", async (req: Request, res: Response)=>{
    const result = await userRepository.getUserByCode(req.body.codeId)
    res.send(result)
})
userRouter.post("/",
    authGuardMiddleware,
    UserValidation(),
    ErrorMiddleware,
    async (req: Request, res: Response)=> {
    const result = await serviceUser.getNewUser(req.body.login, req.body.password, req.body.email)
    res.status(HTTP_STATUS.CREATED_201).send(result)
})

userRouter.delete("/:id",
    authGuardMiddleware,
    async (req: Request, res: Response)=> {
    const deletedUs = await serviceUser.deleteUserById(req.params.id)
    if (!deletedUs){
        res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUS.NO_CONTENT_204)

})