import { Request, Response } from 'express';
import AuthApp from '../../src/auth/app/auth.app';

export default class AuthController {
  public async login(req: Request, res: Response): Promise<any> {
    try {
      const auth: AuthApp = new AuthApp();
      const { email, password } = req.body;
      const data = await auth.login(email, password);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async refresh(req: Request, res: Response): Promise<any> {
    try {
      const auth: AuthApp = new AuthApp();
      const { refreshToken } = req.body;
      const data = await auth.refresh(refreshToken);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async register(req: Request, res: Response) {
    try {
      const auth: AuthApp = new AuthApp();
      const { name, email, password, role_id } = req.body;
      const data = await auth.register(name, email, password, role_id);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }
}
