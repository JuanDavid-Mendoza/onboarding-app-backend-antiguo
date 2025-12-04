import { Router } from 'express';
import UserOnboardingController from './userOnboarding';
import { AuthMiddleware } from '../../src/shared/middleware/auth.middleware';

/* UserOnboardings */
const userOnboardingController: UserOnboardingController = new UserOnboardingController();
const userOnboardingRouter: Router = Router();
const userOnboardingsPath: string = '/userOnboardings';

/* UserOnboardings */
userOnboardingRouter.post(`${userOnboardingsPath}/assign`, AuthMiddleware.authenticate, userOnboardingController.createUserOnboarding);
userOnboardingRouter.put(`${userOnboardingsPath}/update/:id`, AuthMiddleware.authenticate, userOnboardingController.updateUserOnboarding);
userOnboardingRouter.put(`${userOnboardingsPath}/update/:user_id/:onboarding_id`, AuthMiddleware.authenticate, userOnboardingController.updateUserOnboardingByUserAndOnboarding);
userOnboardingRouter.get(`${userOnboardingsPath}/getAll`, AuthMiddleware.authenticate, userOnboardingController.getAllUserOnboardings);
userOnboardingRouter.delete(`${userOnboardingsPath}/unassign/:id`, AuthMiddleware.authenticate, userOnboardingController.deleteUserOnboarding);
userOnboardingRouter.delete(`${userOnboardingsPath}/unassign/:user_id/:onboarding_id`, AuthMiddleware.authenticate, userOnboardingController.deleteUserOnboardingByUserAndOnboarding);

export { userOnboardingRouter };