import { JWTService } from '../../../shared/auth/jwt.service';
import { PasswordService } from '../../../shared/auth/password.service';
import UserPostgreSql from '../../../users/infra/user.postgresql';
import AuthDto from '../dto/auth.dto';

export default class AuthService {
  public constructor(private userPostgre: UserPostgreSql) { }

  public async login(email: string, password: string): Promise<AuthDto | any> {
    if (!email || !password) throw new Error('Email y contraseña son requeridos');
    const prevUser = await this.userPostgre.findByEmail(email);
    if (!prevUser) throw new Error('Credenciales inválidas');

    const isPasswordValid = await PasswordService.comparePassword(password, prevUser.password!);
    if (!isPasswordValid) throw new Error('Credenciales inválidas');

    const tokens = JWTService.generateTokens({
      userId: prevUser.id!,
      email: prevUser.email!,
      roleId: prevUser.role_id!
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: prevUser.id,
        name: prevUser.name,
        email: prevUser.email,
        role_id: prevUser.role_id
      }
    }
  }

  public async refresh(refreshToken: string): Promise<string | any> {
    if (!refreshToken) throw new Error('Refresh token es requerido');
    const decoded = JWTService.verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error('Refresh token inválido o expirado');

    const accessToken = JWTService.generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId
    });

    return { accessToken };
  }

  public async register(name: string, email: string, password: string, role_id: number): Promise<AuthDto | any> {
    if (!name || !email || !password || !role_id) throw new Error('Todos los campos son requeridos');
    const prevUser = await this.userPostgre.findByEmail(email);
    if (prevUser) throw new Error('El email ya está registrado');

    const hashedPassword = await PasswordService.hashPassword(password);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role_id: role_id,
      entry_date: new Date().toISOString().split('T')[0]
    }
    const id = await this.userPostgre.create(newUser)

    const tokens = JWTService.generateTokens({
      userId: id,
      email: newUser.email,
      roleId: newUser.role_id
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: id,
        name: newUser.name,
        email: newUser.email,
        roleId: newUser.role_id
      }
    };
  }
}
