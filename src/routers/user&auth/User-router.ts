import {Response, Request, Router} from "express";
import {searchLogAndEmailInUsers} from "../../repository/qurey-repo/query-filter";
import {ServiceUser} from "../../service-rep/service-user";
import {HTTP_STATUS} from "../../index";
import {UserValidation} from "../../middleware/input-middleware/user-validation";
import {authGuardMiddleware} from "../../middleware/register-middleware";
import {ErrorMiddleware} from "../../middleware/error-middleware";
import {UserRepository} from "../../repository/user-repository";
import {userController} from "../../composition-root/composition-root-user";


export const userRouter = Router()


export class UserController {


    constructor(
        protected userRepository: UserRepository,
        protected serviceUser: ServiceUser
    ) {
    }
    async getAllUserInDB(req: Request, res: Response) {
        const filter = searchLogAndEmailInUsers(req.query)
        const result = await this.userRepository.getAllUsers(filter)
        res.send(result)
    }

    async getUserByCodeIdInDB(req: Request, res: Response) {
        const result = await this.userRepository.findUsersByCode(req.body.codeId)
        res.send(result)
    }

    async createNewUser(req: Request, res: Response) {
        let user = {
            login: req.body.login,
            password: req.body.password,
            email: req.body.email
        }
        const result = await this.serviceUser.getNewUser(user)
        res.status(HTTP_STATUS.CREATED_201).send(result)
    }

    async deleteUserInDB(req: Request, res: Response) {
        const deletedUs = await this.serviceUser.deleteUserById(req.params.id)
        if (!deletedUs) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
            return
        }
        res.sendStatus(HTTP_STATUS.NO_CONTENT_204)

    }
}

// const userControllerInstance = new UserController()

userRouter.get("/", authGuardMiddleware, userController.getAllUserInDB.bind(userController))
userRouter.get("/:codeId", userController.getUserByCodeIdInDB.bind(userController))
userRouter.post("/", authGuardMiddleware, UserValidation(), ErrorMiddleware, userController.createNewUser.bind(userController))
userRouter.delete("/:id", authGuardMiddleware, userController.deleteUserInDB.bind(userController) )