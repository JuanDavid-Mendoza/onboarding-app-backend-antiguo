import { Router } from 'express';
import UserController from './user';
import { AuthMiddleware } from '../../src/shared/middleware/auth.middleware';

/* Users */
const userController: UserController = new UserController();
const userRouter: Router = Router();
const usersPath: string = '/users';

/* Users */
userRouter.post(`${usersPath}/create`, AuthMiddleware.authenticate, userController.createUser);
userRouter.put(`${usersPath}/update/:id`, AuthMiddleware.authenticate, userController.updateUser);
userRouter.get(`${usersPath}/getAll`, AuthMiddleware.authenticate, userController.getAllUsers);
userRouter.delete(`${usersPath}/delete/:id`, AuthMiddleware.authenticate, userController.deleteUser);

export { userRouter };