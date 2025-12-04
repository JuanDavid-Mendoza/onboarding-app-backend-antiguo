import AuthDto from "../domain/dto/auth.dto";
import AuthService from "../domain/services/auth.service";
import UserPostgreSql from "../../users/infra/user.postgresql";

export default class AuthApp {
  public async login(email: string, password: string): Promise<AuthDto> {
    const authService: AuthService = new AuthService(new UserPostgreSql());
    return authService.login(email, password);
  }

  public async refresh(refreshToken: string): Promise<AuthDto> {
    const authService: AuthService = new AuthService(new UserPostgreSql());
    return authService.refresh(refreshToken);
  }

  public async register(name: string, email: string, password: string, role_id: number): Promise<AuthDto> {
    const authService: AuthService = new AuthService(new UserPostgreSql());
    return authService.register(name, email, password, role_id);
  }
}
