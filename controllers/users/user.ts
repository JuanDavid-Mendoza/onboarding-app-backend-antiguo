import { Request, Response } from 'express';
import UserApp from '../../src/users/app/user.app';

export default class UserController {
  public async createUser(req: Request, res: Response) { 
    try {
      const users: UserApp = new UserApp();
      const data = await users.create(req.body);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async updateUser(req: Request, res: Response) { 
    try {
      const id = Number(req.params.id);
      const users: UserApp = new UserApp();
      const data = await users.update(req.body, id);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users: UserApp = new UserApp();
      const data = await users.getAll();
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const users: UserApp = new UserApp();
      const data = await users.delete(id);
      return data ? res.status(200).json(data) : res.status(200).json();
    } catch (e) {
      return res.status(500).json({ message: 'Ocurrió un error inesperado' });
    }
  }
}
