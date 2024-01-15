import {injectable} from "inversify";
import {UserRepository} from "../repository/user-repository";
import {ServiceUser} from "../service-rep/service-user";
import {Request, Response} from "express";
import {searchLogAndEmailInUsers} from "../repository/qurey-repo/query-filter";
import {HTTP_STATUS} from "../index";

@injectable()
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