import { Request, Response } from 'express';
import OnboardingApp from '../../src/onboardings/app/onboarding.app';
import { AuthRequest } from '../../src/shared/middleware/auth.middleware';
import UserPostgreSql from '../../src/users/infra/user.postgresql';

export default class OnboardingController {
  public async createOnboarding(req: Request, res: Response) {
    try {
      const onboardings: OnboardingApp = new OnboardingApp();
      const data = await onboardings.create(req.body);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async updateOnboarding(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const onboardings: OnboardingApp = new OnboardingApp();

      let senderEmail = req.user?.email;
      let senderName = req.user?.email?.split('@')[0];

      if (req.user?.userId) {
        try {
          const userPostgre = new UserPostgreSql();
          const senderUser = await userPostgre.findById(req.user.userId);
          if (senderUser && senderUser.email) {
            senderEmail = senderUser.email;
            senderName = senderUser.name || senderEmail.split('@')[0];
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
        }
      }

      const data = await onboardings.update(req.body, id, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async getAllOnboardings(req: Request, res: Response) {
    try {
      const onboardings: OnboardingApp = new OnboardingApp();
      const data = await onboardings.getAll();
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async deleteOnboarding(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const onboardings: OnboardingApp = new OnboardingApp();

      let senderEmail = req.user?.email;
      let senderName = req.user?.email?.split('@')[0];

      if (req.user?.userId) {
        try {
          const userPostgre = new UserPostgreSql();
          const senderUser = await userPostgre.findById(req.user.userId);
          if (senderUser && senderUser.email) {
            senderEmail = senderUser.email;
            senderName = senderUser.name || senderEmail.split('@')[0];
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
        }
      }

      const data = await onboardings.delete(id, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }
}
