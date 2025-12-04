import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../shared/auth/jwt.service';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    roleId: number;
  };
}

export class AuthMiddleware {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
      }

      const token = authHeader.substring(7);
      const decoded = JWTService.verifyAccessToken(token);

      if (!decoded) {
        res.status(401).json({ message: 'Token inválido o expirado' });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Error de autenticación' });
    }
  }
}
