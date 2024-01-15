import {UserRepository} from "../repository/user-repository";
import {ServiceUser} from "../service-rep/service-user";
import {Container} from "inversify";
import {UserController} from "../contoller/user-controller";
import {AuthController} from "../contoller/auth-controller";
import {JwtService} from "../application/jwt-service";
import {RefreshTokenRepo} from "../repository/refreshToken-repo";
import {DeletedTokenRepoRepository} from "../repository/deletedTokenRepo-repository";
import {SecurityDeviceService} from "../service-rep/security-device-service";
import {SecurityDevicesRepo} from "../repository/security-devices-repo";
import {BlogController} from "../contoller/blog-controller";
import {ServiceBlogs} from "../service-rep/service-blogs";
import {ServicePosts} from "../service-rep/service-posts";
import {PostsRepository} from "../repository/posts-repository";
import {BlogsRepository} from "../repository/blogs-repository";
import {CommentsController} from "../contoller/comment-controller";
import {ServiceComments} from "../service-rep/service-comments";
import {CommentsRepository} from "../repository/comments-repository";
import {DeviceController} from "../contoller/securityDevice-controller";
import {PostsController} from "../contoller/post-controller";
import {AuthService} from "../domain/auth-service";
import {EmailManager} from "../manager/email-manager";
import {EmailAdapter} from "../adapters/email-adapter";




export const container = new Container()
container.bind(UserController).to(UserController)
container.bind(AuthController).to(AuthController)
container.bind(BlogController).to(BlogController)
container.bind(CommentsController).to(CommentsController)
container.bind(DeviceController).to(DeviceController)
container.bind(PostsController).to(PostsController)

container.bind<ServiceUser>(ServiceUser).to(ServiceUser)
container.bind<SecurityDeviceService>(SecurityDeviceService).to(SecurityDeviceService)
container.bind<JwtService>(JwtService).to(JwtService)
container.bind<ServiceBlogs>(ServiceBlogs).to(ServiceBlogs)
container.bind<ServicePosts>(ServicePosts).to(ServicePosts)
container.bind<ServiceComments>(ServiceComments).to(ServiceComments)
container.bind<AuthService>(AuthService).to(AuthService)



container.bind<UserRepository>(UserRepository).to(UserRepository)
container.bind<RefreshTokenRepo>(RefreshTokenRepo).to(RefreshTokenRepo)
container.bind<DeletedTokenRepoRepository>(DeletedTokenRepoRepository).to(DeletedTokenRepoRepository)
container.bind<SecurityDevicesRepo>(SecurityDevicesRepo).to(SecurityDevicesRepo)
container.bind<PostsRepository>(PostsRepository).to(PostsRepository)
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository)
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)
container.bind<EmailManager>(EmailManager).to(EmailManager)
container.bind<EmailAdapter>(EmailAdapter).to(EmailAdapter)

















