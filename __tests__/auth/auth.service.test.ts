import AuthService from '../../src/auth/domain/services/auth.service';
import UserPostgreSql from '../../src/users/infra/user.postgresql';
import { JWTService } from '../../src/shared/auth/jwt.service';
import { PasswordService } from '../../src/shared/auth/password.service';
import UserModel from '../../src/users/domain/models/user.model';

jest.mock('../../src/users/infra/user.postgresql');
jest.mock('../../src/shared/auth/jwt.service');
jest.mock('../../src/shared/auth/password.service');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserPostgre: jest.Mocked<UserPostgreSql>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserPostgre = new UserPostgreSql() as jest.Mocked<UserPostgreSql>;
    authService = new AuthService(mockUserPostgre);
  });

  describe('register', () => {
    const validRegisterData = {
      name: 'Juan Pérez',
      email: 'juan.perez@test.com',
      password: 'Password123!',
      role_id: 2
    };

    it('debería registrar un nuevo usuario exitosamente', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockUserId = 1;
      const mockTokens = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      };

      mockUserPostgre.findByEmail.mockResolvedValue(null);
      mockUserPostgre.create.mockResolvedValue(mockUserId);
      (PasswordService.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (JWTService.generateTokens as jest.Mock).mockReturnValue(mockTokens);

      const result = await authService.register(
        validRegisterData.name,
        validRegisterData.email,
        validRegisterData.password,
        validRegisterData.role_id
      );

      expect(mockUserPostgre.findByEmail).toHaveBeenCalledWith(validRegisterData.email);
      expect(PasswordService.hashPassword).toHaveBeenCalledWith(validRegisterData.password);
      expect(mockUserPostgre.create).toHaveBeenCalledWith({
        name: validRegisterData.name,
        email: validRegisterData.email,
        password: hashedPassword,
        role_id: validRegisterData.role_id,
        entry_date: expect.any(String)
      });
      expect(JWTService.generateTokens).toHaveBeenCalledWith({
        userId: mockUserId,
        email: validRegisterData.email,
        roleId: validRegisterData.role_id
      });
      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        user: {
          id: mockUserId,
          name: validRegisterData.name,
          email: validRegisterData.email,
          roleId: validRegisterData.role_id
        }
      });
    });

    it('debería lanzar error si falta el nombre', async () => {
      await expect(
        authService.register('', validRegisterData.email, validRegisterData.password, validRegisterData.role_id)
      ).rejects.toThrow('Todos los campos son requeridos');
    });

    it('debería lanzar error si falta el email', async () => {
      await expect(
        authService.register(validRegisterData.name, '', validRegisterData.password, validRegisterData.role_id)
      ).rejects.toThrow('Todos los campos son requeridos');
    });

    it('debería lanzar error si falta la contraseña', async () => {

      await expect(
        authService.register(validRegisterData.name, validRegisterData.email, '', validRegisterData.role_id)
      ).rejects.toThrow('Todos los campos son requeridos');
    });

    it('debería lanzar error si falta el role_id', async () => {
      await expect(
        authService.register(validRegisterData.name, validRegisterData.email, validRegisterData.password, 0)
      ).rejects.toThrow('Todos los campos son requeridos');
    });

    it('debería lanzar error si el email ya está registrado', async () => {
      const existingUser: UserModel = {
        id: 1,
        name: 'Usuario Existente',
        email: validRegisterData.email,
        password: 'hashedPassword',
        role_id: 2,
        entry_date: '2024-01-01'
      };
      mockUserPostgre.findByEmail.mockResolvedValue(existingUser);

      await expect(
        authService.register(
          validRegisterData.name,
          validRegisterData.email,
          validRegisterData.password,
          validRegisterData.role_id
        )
      ).rejects.toThrow('El email ya está registrado');

      expect(mockUserPostgre.findByEmail).toHaveBeenCalledWith(validRegisterData.email);
      expect(mockUserPostgre.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'juan.perez@test.com',
      password: 'Password123!'
    };

    const mockUser: UserModel = {
      id: 1,
      name: 'Juan Pérez',
      email: validLoginData.email,
      password: 'hashedPassword123',
      role_id: 2,
      entry_date: '2024-01-01'
    };

    it('debería hacer login exitosamente con credenciales válidas', async () => {

      const mockTokens = {
        accessToken: 'mockAccessToken',
        refreshToken: 'mockRefreshToken'
      };

      mockUserPostgre.findByEmail.mockResolvedValue(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValue(true);
      (JWTService.generateTokens as jest.Mock).mockReturnValue(mockTokens);


      const result = await authService.login(validLoginData.email, validLoginData.password);

      expect(mockUserPostgre.findByEmail).toHaveBeenCalledWith(validLoginData.email);
      expect(PasswordService.comparePassword).toHaveBeenCalledWith(
        validLoginData.password,
        mockUser.password
      );
      expect(JWTService.generateTokens).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
        roleId: mockUser.role_id
      });
      expect(result).toEqual({
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role_id: mockUser.role_id
        }
      });
    });

    it('debería lanzar error si falta el email', async () => {

      await expect(
        authService.login('', validLoginData.password)
      ).rejects.toThrow('Email y contraseña son requeridos');
    });

    it('debería lanzar error si falta la contraseña', async () => {

      await expect(
        authService.login(validLoginData.email, '')
      ).rejects.toThrow('Email y contraseña son requeridos');
    });

    it('debería lanzar error si el usuario no existe', async () => {

      mockUserPostgre.findByEmail.mockResolvedValue(null);


      await expect(
        authService.login(validLoginData.email, validLoginData.password)
      ).rejects.toThrow('Credenciales inválidas');

      expect(mockUserPostgre.findByEmail).toHaveBeenCalledWith(validLoginData.email);
      expect(PasswordService.comparePassword).not.toHaveBeenCalled();
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {

      mockUserPostgre.findByEmail.mockResolvedValue(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValue(false);


      await expect(
        authService.login(validLoginData.email, validLoginData.password)
      ).rejects.toThrow('Credenciales inválidas');

      expect(mockUserPostgre.findByEmail).toHaveBeenCalledWith(validLoginData.email);
      expect(PasswordService.comparePassword).toHaveBeenCalledWith(
        validLoginData.password,
        mockUser.password
      );
      expect(JWTService.generateTokens).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    const validRefreshToken = 'validRefreshToken123';
    const mockDecodedToken = {
      userId: 1,
      email: 'juan.perez@test.com',
      roleId: 2
    };

    it('debería generar un nuevo access token exitosamente', async () => {

      const mockAccessToken = 'newMockAccessToken';
      (JWTService.verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedToken);
      (JWTService.generateAccessToken as jest.Mock).mockReturnValue(mockAccessToken);


      const result = await authService.refresh(validRefreshToken);

      expect(JWTService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshToken);
      expect(JWTService.generateAccessToken).toHaveBeenCalledWith({
        userId: mockDecodedToken.userId,
        email: mockDecodedToken.email,
        roleId: mockDecodedToken.roleId
      });
      expect(result).toEqual({
        accessToken: mockAccessToken
      });
    });

    it('debería lanzar error si falta el refresh token', async () => {

      await expect(
        authService.refresh('')
      ).rejects.toThrow('Refresh token es requerido');

      expect(JWTService.verifyRefreshToken).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el refresh token es inválido', async () => {

      (JWTService.verifyRefreshToken as jest.Mock).mockReturnValue(null);


      await expect(
        authService.refresh(validRefreshToken)
      ).rejects.toThrow('Refresh token inválido o expirado');

      expect(JWTService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshToken);
      expect(JWTService.generateAccessToken).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el refresh token está expirado', async () => {

      (JWTService.verifyRefreshToken as jest.Mock).mockReturnValue(null);


      await expect(
        authService.refresh(validRefreshToken)
      ).rejects.toThrow('Refresh token inválido o expirado');

      expect(JWTService.verifyRefreshToken).toHaveBeenCalledWith(validRefreshToken);
    });
  });

  describe('Integración de casos de uso completos', () => {
    it('debería completar el flujo de registro -> login -> refresh', async () => {
      const registerData = {
        name: 'María García',
        email: 'maria.garcia@test.com',
        password: 'SecurePass123!',
        role_id: 2
      };

      const hashedPassword = 'hashedSecurePass123';
      const mockUserId = 5;
      const mockRegisterTokens = {
        accessToken: 'registerAccessToken',
        refreshToken: 'registerRefreshToken'
      };

      mockUserPostgre.findByEmail.mockResolvedValueOnce(null);
      mockUserPostgre.create.mockResolvedValue(mockUserId);
      (PasswordService.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (JWTService.generateTokens as jest.Mock).mockReturnValue(mockRegisterTokens);


      const registerResult = await authService.register(
        registerData.name,
        registerData.email,
        registerData.password,
        registerData.role_id
      );


      expect(registerResult.accessToken).toBe(mockRegisterTokens.accessToken);
      expect(registerResult.refreshToken).toBe(mockRegisterTokens.refreshToken);
      expect(registerResult.user.email).toBe(registerData.email);

      const mockUser: UserModel = {
        id: mockUserId,
        name: registerData.name,
        email: registerData.email,
        password: hashedPassword,
        role_id: registerData.role_id,
        entry_date: '2024-01-01'
      };

      const mockLoginTokens = {
        accessToken: 'loginAccessToken',
        refreshToken: 'loginRefreshToken'
      };

      mockUserPostgre.findByEmail.mockResolvedValueOnce(mockUser);
      (PasswordService.comparePassword as jest.Mock).mockResolvedValue(true);
      (JWTService.generateTokens as jest.Mock).mockReturnValue(mockLoginTokens);


      const loginResult = await authService.login(registerData.email, registerData.password);


      expect(loginResult.accessToken).toBe(mockLoginTokens.accessToken);
      expect(loginResult.refreshToken).toBe(mockLoginTokens.refreshToken);


      const mockDecodedToken = {
        userId: mockUserId,
        email: registerData.email,
        roleId: registerData.role_id
      };
      const newAccessToken = 'newAccessToken';

      (JWTService.verifyRefreshToken as jest.Mock).mockReturnValue(mockDecodedToken);
      (JWTService.generateAccessToken as jest.Mock).mockReturnValue(newAccessToken);


      const refreshResult = await authService.refresh(loginResult.refreshToken);


      expect(refreshResult.accessToken).toBe(newAccessToken);
    });
  });
});
