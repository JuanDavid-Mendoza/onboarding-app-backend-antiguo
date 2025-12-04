import { Router } from 'express';
import AuthController from './auth';

/* Auth */
const authController: AuthController = new AuthController();
const authRouter: Router = Router();
const authPath: string = '/auth';

/* Auth */
authRouter.post(`${authPath}/login`, authController.login);
authRouter.post(`${authPath}/register`, authController.register);
authRouter.post(`${authPath}/refresh`, authController.refresh);

export { authRouter };
