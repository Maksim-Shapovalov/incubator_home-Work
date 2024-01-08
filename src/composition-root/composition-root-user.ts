import {UserRepository} from "../repository/user-repository";
import {ServiceUser} from "../service-rep/service-user";
import {UserController} from "../routers/user&auth/User-router";

const userRepository = new UserRepository()
const userService = new ServiceUser(userRepository)
export const userController = new UserController(userRepository, userService)