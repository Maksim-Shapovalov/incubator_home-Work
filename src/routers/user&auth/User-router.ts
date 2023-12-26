import {Response, Request, Router} from "express";
import {searchLogAndEmailInUsers} from "../../repository/qurey-repo/query-filter";
import {userRepository} from "../../repository/user-repository";
import {serviceUser} from "../../service-rep/service-user";
import {HTTP_STATUS} from "../../index";
import {UserValidation} from "../../middleware/input-middleware/user-validation";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {ErrorMiddleware} from "../../middleware/error-middleware";


export const userRouter = Router()


class UserController {
    async getAllUserInDB(req: Request, res: Response) {
        const filter = searchLogAndEmailInUsers(req.query)
        const result = await userRepository.getAllUsers(filter)
        res.send(result)
    }

    async getUserByCodeIdInDB(req: Request, res: Response) {
        const result = await userRepository.findUsersbyCode(req.body.codeId)
        res.send(result)
    }

    async createNewUser(req: Request, res: Response) {
        let user = {
            login: req.body.login,
            password: req.body.password,
            email: req.body.email
        }
        const result = await serviceUser.getNewUser(user)
        res.status(HTTP_STATUS.CREATED_201).send(result)
    }

    async deleteUserInDB(req: Request, res: Response) {
        const deletedUs = await serviceUser.deleteUserById(req.params.id)
        if (!deletedUs) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)

    }
}

const userControllerInstance = new UserController()

userRouter.get("/", authGuardMiddleware, userControllerInstance.getAllUserInDB)
userRouter.get("/:codeId", userControllerInstance.getUserByCodeIdInDB)
userRouter.post("/", authGuardMiddleware, UserValidation(), ErrorMiddleware, userControllerInstance.createNewUser)
userRouter.delete("/:id", authGuardMiddleware, userControllerInstance.deleteUserInDB )