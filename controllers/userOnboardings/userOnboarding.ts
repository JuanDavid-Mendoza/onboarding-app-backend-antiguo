import { Request, Response } from 'express';
import UserOnboardingApp from '../../src/userOnboardings/app/userOnboarding.app';
import { AuthRequest } from '../../src/shared/middleware/auth.middleware';
import UserPostgreSql from '../../src/users/infra/user.postgresql';

export default class UserOnboardingController {
  public async createUserOnboarding(req: AuthRequest, res: Response) {
    try {
      const userOnboardings: UserOnboardingApp = new UserOnboardingApp();

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

      const data = await userOnboardings.create(req.body, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async updateUserOnboarding(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userOnboardings: UserOnboardingApp = new UserOnboardingApp();

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

      const data = await userOnboardings.update(req.body, id, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async updateUserOnboardingByUserAndOnboarding(req: AuthRequest, res: Response) {
    try {
      const user_id = Number(req.params.user_id);
      const onboarding_id = Number(req.params.onboarding_id);
      const userOnboardings: UserOnboardingApp = new UserOnboardingApp();


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

      const data = await userOnboardings.updateUserOnboardingByUserAndOnboarding(req.body, user_id, onboarding_id, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async getAllUserOnboardings(req: Request, res: Response) {
    try {
      const { user_id } = req.query;
      const userOnboardings: UserOnboardingApp = new UserOnboardingApp();
      const data = await userOnboardings.getAll(user_id ? Number(user_id) : undefined);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async deleteUserOnboarding(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const userOnboardings: UserOnboardingApp = new UserOnboardingApp();

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

      const data = await userOnboardings.delete(id, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async deleteUserOnboardingByUserAndOnboarding(req: AuthRequest, res: Response) {
    try {
      const user_id = Number(req.params.user_id);
      const onboarding_id = Number(req.params.onboarding_id);
      const userOnboardings: UserOnboardingApp = new UserOnboardingApp();

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

      const data = await userOnboardings.deleteUserOnboardingByUserAndOnboarding(user_id, onboarding_id, senderEmail, senderName);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }
}
