import { Router } from 'express';
import OnboardingController from './onboarding';
import { AuthMiddleware } from '../../src/shared/middleware/auth.middleware';

/* Onboardings */
const onboardingController: OnboardingController = new OnboardingController();
const onboardingRouter: Router = Router();
const onboardingsPath: string = '/onboardings';

/* Onboardings */
onboardingRouter.post(`${onboardingsPath}/create`, AuthMiddleware.authenticate, onboardingController.createOnboarding);
onboardingRouter.put(`${onboardingsPath}/update/:id`, AuthMiddleware.authenticate, onboardingController.updateOnboarding);
onboardingRouter.get(`${onboardingsPath}/getAll`, AuthMiddleware.authenticate, onboardingController.getAllOnboardings);
onboardingRouter.delete(`${onboardingsPath}/delete/:id`, AuthMiddleware.authenticate, onboardingController.deleteOnboarding);

export { onboardingRouter };