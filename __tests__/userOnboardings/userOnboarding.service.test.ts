import UserOnboardingService from '../../src/userOnboardings/domain/services/userOnboarding.service';
import UserOnboardingPostgreSql from '../../src/userOnboardings/infra/userOnboarding.postgresql';
import UserPostgreSql from '../../src/users/infra/user.postgresql';
import OnboardingPostgreSql from '../../src/onboardings/infra/onboarding.postgresql';
import { EmailService } from '../../src/shared/email/email.service';
import UserOnboardingModel from '../../src/userOnboardings/domain/models/userOnboarding.model';
import UserModel from '../../src/users/domain/models/user.model';
import OnboardingModel from '../../src/onboardings/domain/models/onboarding.model';


jest.mock('../../src/userOnboardings/infra/userOnboarding.postgresql');
jest.mock('../../src/users/infra/user.postgresql');
jest.mock('../../src/onboardings/infra/onboarding.postgresql');
jest.mock('../../src/shared/email/email.service');

describe('UserOnboardingService', () => {
  let userOnboardingService: UserOnboardingService;
  let mockUserOnboardingPostgre: jest.Mocked<UserOnboardingPostgreSql>;
  let mockUserPostgre: jest.Mocked<UserPostgreSql>;
  let mockOnboardingPostgre: jest.Mocked<OnboardingPostgreSql>;

  beforeEach(() => {

    jest.clearAllMocks();


    mockUserOnboardingPostgre = new UserOnboardingPostgreSql() as jest.Mocked<UserOnboardingPostgreSql>;
    mockUserPostgre = new UserPostgreSql() as jest.Mocked<UserPostgreSql>;
    mockOnboardingPostgre = new OnboardingPostgreSql() as jest.Mocked<OnboardingPostgreSql>;

    userOnboardingService = new UserOnboardingService(
      mockUserOnboardingPostgre,
      mockUserPostgre,
      mockOnboardingPostgre
    );
  });

  describe('create', () => {
    const validUserOnboardingData: UserOnboardingModel = {
      user_id: 10,
      onboarding_id: 5,
      state: 0
    };

    it('debería crear una asignación de usuario-onboarding exitosamente', async () => {

      const mockId = 1;
      mockUserOnboardingPostgre.create.mockResolvedValue(mockId);


      const result = await userOnboardingService.create(validUserOnboardingData);


      expect(mockUserOnboardingPostgre.create).toHaveBeenCalledWith(validUserOnboardingData);
      expect(result).toEqual({
        ...validUserOnboardingData,
        id: mockId
      });
    });

    it('debería crear y enviar email de asignación', async () => {

      const mockId = 1;
      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: 5,
        name: 'Onboarding Backend',
        description: 'Proceso de onboarding para backend',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      mockUserOnboardingPostgre.create.mockResolvedValue(mockId);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      (EmailService.sendOnboardingAssignmentEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await userOnboardingService.create(
        validUserOnboardingData,
        senderEmail,
        senderName
      );


      expect(mockUserPostgre.findById).toHaveBeenCalledWith(10);
      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(5);
      expect(EmailService.sendOnboardingAssignmentEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name,
        senderEmail,
        senderName,
        mockOnboarding.name,
        mockOnboarding.description
      );
      expect(result).toEqual({
        ...validUserOnboardingData,
        id: mockId
      });
    });

    it('debería crear sin enviar email si falta información del sender', async () => {

      const mockId = 1;
      mockUserOnboardingPostgre.create.mockResolvedValue(mockId);


      const result = await userOnboardingService.create(validUserOnboardingData);


      expect(mockUserOnboardingPostgre.create).toHaveBeenCalled();
      expect(mockUserPostgre.findById).not.toHaveBeenCalled();
      expect(mockOnboardingPostgre.findById).not.toHaveBeenCalled();
      expect(EmailService.sendOnboardingAssignmentEmail).not.toHaveBeenCalled();
      expect(result.id).toBe(mockId);
    });

    it('debería manejar errores de email sin afectar la creación', async () => {

      const mockId = 1;
      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockUserOnboardingPostgre.create.mockResolvedValue(mockId);
      mockUserPostgre.findById.mockRejectedValue(new Error('Database error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      const result = await userOnboardingService.create(
        validUserOnboardingData,
        senderEmail,
        senderName
      );


      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result.id).toBe(mockId);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('update', () => {
    const userOnboardingId = 1;
    const updateData: UserOnboardingModel = {
      state: 1
    };

    const currentRecord: UserOnboardingModel = {
      id: userOnboardingId,
      user_id: 10,
      onboarding_id: 5,
      state: 0
    };

    it('debería actualizar sin enviar email', async () => {

      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);


      const result = await userOnboardingService.update(updateData, userOnboardingId);


      expect(mockUserOnboardingPostgre.update).toHaveBeenCalledWith(updateData, userOnboardingId);
      expect(result).toEqual({ ...updateData, id: userOnboardingId });
      expect(mockUserOnboardingPostgre.findById).not.toHaveBeenCalled();
    });

    it('debería actualizar y enviar email con estado actualizado', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: 5,
        name: 'Onboarding Backend',
        description: 'Proceso de onboarding',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      (EmailService.sendOnboardingUpdateEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await userOnboardingService.update(
        updateData,
        userOnboardingId,
        senderEmail,
        senderName
      );


      expect(mockUserOnboardingPostgre.findById).toHaveBeenCalledWith(userOnboardingId);
      expect(mockUserOnboardingPostgre.update).toHaveBeenCalledWith(updateData, userOnboardingId);
      expect(EmailService.sendOnboardingUpdateEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name,
        senderEmail,
        senderName,
        mockOnboarding.name,
        mockOnboarding.description,
        'Completado'
      );
      expect(result).toEqual({ ...updateData, id: userOnboardingId });
    });

    it('debería actualizar incluso si no encuentra el registro actual', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockUserOnboardingPostgre.findById.mockResolvedValue(null);
      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);


      const result = await userOnboardingService.update(
        updateData,
        userOnboardingId,
        senderEmail,
        senderName
      );


      expect(mockUserOnboardingPostgre.findById).toHaveBeenCalledWith(userOnboardingId);
      expect(mockUserOnboardingPostgre.update).toHaveBeenCalledWith(updateData, userOnboardingId);
      expect(EmailService.sendOnboardingUpdateEmail).not.toHaveBeenCalled();
      expect(result).toEqual({ ...updateData, id: userOnboardingId });
    });

    it('debería manejar errores de email y continuar con la actualización', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserPostgre.findById.mockRejectedValue(new Error('Database error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      const result = await userOnboardingService.update(
        updateData,
        userOnboardingId,
        senderEmail,
        senderName
      );


      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockUserOnboardingPostgre.update).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ ...updateData, id: userOnboardingId });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateUserOnboardingByUserAndOnboarding', () => {
    const userId = 10;
    const onboardingId = 5;
    const updateData: UserOnboardingModel = {
      state: 1
    };

    it('debería actualizar por userId y onboardingId sin email', async () => {

      mockUserOnboardingPostgre.updateUserOnboardingByUserAndOnboarding.mockResolvedValue(undefined);


      const result = await userOnboardingService.updateUserOnboardingByUserAndOnboarding(
        updateData,
        userId,
        onboardingId
      );


      expect(mockUserOnboardingPostgre.updateUserOnboardingByUserAndOnboarding).toHaveBeenCalledWith(
        updateData,
        userId,
        onboardingId
      );
      expect(result).toEqual({
        ...updateData,
        user_id: userId,
        onboarding_id: onboardingId
      });
    });

    it('debería actualizar y enviar email', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: userId,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: onboardingId,
        name: 'Onboarding Backend',
        description: 'Proceso de onboarding',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      mockUserOnboardingPostgre.updateUserOnboardingByUserAndOnboarding.mockResolvedValue(undefined);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      (EmailService.sendOnboardingUpdateEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await userOnboardingService.updateUserOnboardingByUserAndOnboarding(
        updateData,
        userId,
        onboardingId,
        senderEmail,
        senderName
      );


      expect(mockUserPostgre.findById).toHaveBeenCalledWith(userId);
      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(EmailService.sendOnboardingUpdateEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name,
        senderEmail,
        senderName,
        mockOnboarding.name,
        mockOnboarding.description,
        'Completado'
      );
      expect(result).toEqual({
        ...updateData,
        user_id: userId,
        onboarding_id: onboardingId
      });
    });

    it('debería manejar errores de email sin afectar la actualización', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockUserOnboardingPostgre.updateUserOnboardingByUserAndOnboarding.mockResolvedValue(undefined);
      mockUserPostgre.findById.mockRejectedValue(new Error('Database error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      const result = await userOnboardingService.updateUserOnboardingByUserAndOnboarding(
        updateData,
        userId,
        onboardingId,
        senderEmail,
        senderName
      );


      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toEqual({
        ...updateData,
        user_id: userId,
        onboarding_id: onboardingId
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getAll', () => {
    it('debería obtener todas las asignaciones', async () => {

      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: 5,
          state: 0
        },
        {
          id: 2,
          user_id: 20,
          onboarding_id: 6,
          state: 1
        }
      ];

      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);


      const result = await userOnboardingService.getAll(undefined);


      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockUserOnboardings);
      expect(result).toHaveLength(2);
    });

    it('debería obtener asignaciones filtradas por usuario', async () => {

      const userId = 10;
      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: 5,
          state: 0
        }
      ];

      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);


      const result = await userOnboardingService.getAll(userId);


      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUserOnboardings);
      expect(result).toHaveLength(1);
    });

    it('debería retornar array vacío si no hay asignaciones', async () => {

      mockUserOnboardingPostgre.getAll.mockResolvedValue([]);


      const result = await userOnboardingService.getAll(undefined);


      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('delete', () => {
    const userOnboardingId = 1;
    const currentRecord: UserOnboardingModel = {
      id: userOnboardingId,
      user_id: 10,
      onboarding_id: 5,
      state: 0
    };

    it('debería eliminar sin enviar emails', async () => {

      mockUserOnboardingPostgre.delete.mockResolvedValue(userOnboardingId);


      const result = await userOnboardingService.delete(userOnboardingId);


      expect(mockUserOnboardingPostgre.delete).toHaveBeenCalledWith(userOnboardingId);
      expect(result).toBe(userOnboardingId);
      expect(mockUserOnboardingPostgre.findById).not.toHaveBeenCalled();
    });

    it('debería eliminar y enviar emails a todos los usuarios del onboarding', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockOnboarding: OnboardingModel = {
        id: 5,
        name: 'Onboarding Backend',
        description: 'Proceso de onboarding',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      const mockAllUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: 5,
          state: 0
        },
        {
          id: 2,
          user_id: 20,
          onboarding_id: 5,
          state: 1
        },
        {
          id: 3,
          user_id: 30,
          onboarding_id: 6,
          state: 0
        }
      ];

      const mockUser1: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockUser2: UserModel = {
        id: 20,
        name: 'María García',
        email: 'maria.garcia@banco.com',
        role_id: 2,
        entry_date: '2024-01-02',
        password: 'hashed'
      };

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserPostgre.findById
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser1)
        .mockResolvedValueOnce(mockUser2);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockAllUserOnboardings);
      mockUserOnboardingPostgre.delete.mockResolvedValue(userOnboardingId);
      (EmailService.sendOnboardingRemovalEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await userOnboardingService.delete(
        userOnboardingId,
        senderEmail,
        senderName
      );


      expect(mockUserOnboardingPostgre.findById).toHaveBeenCalledWith(userOnboardingId);
      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalledWith(undefined);
      expect(mockUserOnboardingPostgre.delete).toHaveBeenCalledWith(userOnboardingId);
      expect(EmailService.sendOnboardingRemovalEmail).toHaveBeenCalledTimes(2);
      expect(result).toBe(userOnboardingId);
    });

    it('debería eliminar sin enviar emails si no encuentra el registro', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockUserOnboardingPostgre.findById.mockResolvedValue(null);
      mockUserOnboardingPostgre.delete.mockResolvedValue(userOnboardingId);


      const result = await userOnboardingService.delete(
        userOnboardingId,
        senderEmail,
        senderName
      );


      expect(mockUserOnboardingPostgre.findById).toHaveBeenCalledWith(userOnboardingId);
      expect(mockUserOnboardingPostgre.delete).toHaveBeenCalledWith(userOnboardingId);
      expect(EmailService.sendOnboardingRemovalEmail).not.toHaveBeenCalled();
      expect(result).toBe(userOnboardingId);
    });

    it('debería manejar errores de email sin afectar la eliminación', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: 5,
        name: 'Onboarding Backend',
        description: 'Proceso de onboarding',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      const mockAllUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: 5,
          state: 0
        }
      ];

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserPostgre.findById
        .mockResolvedValueOnce(mockUser)
        .mockRejectedValue(new Error('Database error'));
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockAllUserOnboardings);
      mockUserOnboardingPostgre.delete.mockResolvedValue(userOnboardingId);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      const result = await userOnboardingService.delete(
        userOnboardingId,
        senderEmail,
        senderName
      );


      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockUserOnboardingPostgre.delete).toHaveBeenCalled();
      expect(result).toBe(userOnboardingId);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteUserOnboardingByUserAndOnboarding', () => {
    const userId = 10;
    const onboardingId = 5;

    it('debería eliminar por userId y onboardingId sin email', async () => {

      mockUserOnboardingPostgre.deleteUserOnboardingByUserAndOnboarding.mockResolvedValue(1);


      const result = await userOnboardingService.deleteUserOnboardingByUserAndOnboarding(
        userId,
        onboardingId
      );


      expect(mockUserOnboardingPostgre.deleteUserOnboardingByUserAndOnboarding).toHaveBeenCalledWith(
        userId,
        onboardingId
      );
      expect(result).toBe(1);
    });

    it('debería eliminar y enviar email al usuario específico', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: userId,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: onboardingId,
        name: 'Onboarding Backend',
        description: 'Proceso de onboarding',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      mockUserOnboardingPostgre.deleteUserOnboardingByUserAndOnboarding.mockResolvedValue(1);
      (EmailService.sendOnboardingRemovalEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await userOnboardingService.deleteUserOnboardingByUserAndOnboarding(
        userId,
        onboardingId,
        senderEmail,
        senderName
      );


      expect(mockUserPostgre.findById).toHaveBeenCalledWith(userId);
      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockUserOnboardingPostgre.deleteUserOnboardingByUserAndOnboarding).toHaveBeenCalledWith(
        userId,
        onboardingId
      );
      expect(EmailService.sendOnboardingRemovalEmail).toHaveBeenCalledWith(
        mockUser.email,
        mockUser.name,
        senderEmail,
        senderName,
        mockOnboarding.name,
        mockOnboarding.description
      );
      expect(result).toBe(1);
    });

    it('debería propagar errores durante la eliminación', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockUserPostgre.findById.mockRejectedValue(new Error('Database error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      await expect(
        userOnboardingService.deleteUserOnboardingByUserAndOnboarding(
          userId,
          onboardingId,
          senderEmail,
          senderName
        )
      ).rejects.toThrow('Database error');

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('getStateText', () => {
    it('debería retornar "Completado" para estado 1', async () => {

      const updateData: UserOnboardingModel = { state: 1 };
      const userOnboardingId = 1;
      const currentRecord: UserOnboardingModel = {
        id: userOnboardingId,
        user_id: 10,
        onboarding_id: 5,
        state: 0
      };

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: 5,
        name: 'Onboarding Backend',
        description: 'Test',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      (EmailService.sendOnboardingUpdateEmail as jest.Mock).mockResolvedValue(undefined);


      await userOnboardingService.update(updateData, userOnboardingId, senderEmail, senderName);


      expect(EmailService.sendOnboardingUpdateEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        'Completado'
      );
    });

    it('debería retornar "En progreso" para estado 0', async () => {

      const updateData: UserOnboardingModel = { state: 0 };
      const userOnboardingId = 1;
      const currentRecord: UserOnboardingModel = {
        id: userOnboardingId,
        user_id: 10,
        onboarding_id: 5,
        state: 1
      };

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: 5,
        name: 'Onboarding Backend',
        description: 'Test',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      (EmailService.sendOnboardingUpdateEmail as jest.Mock).mockResolvedValue(undefined);


      await userOnboardingService.update(updateData, userOnboardingId, senderEmail, senderName);


      expect(EmailService.sendOnboardingUpdateEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
        'En progreso'
      );
    });
  });

  describe('Casos de integración', () => {
    it('debería completar el flujo: crear -> actualizar -> eliminar con emails', async () => {

      const userId = 10;
      const onboardingId = 5;
      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const createData: UserOnboardingModel = {
        user_id: userId,
        onboarding_id: onboardingId,
        state: 0
      };

      const mockUser: UserModel = {
        id: userId,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      const mockOnboarding: OnboardingModel = {
        id: onboardingId,
        name: 'Onboarding Backend',
        description: 'Test completo',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };


      mockUserOnboardingPostgre.create.mockResolvedValue(1);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      mockOnboardingPostgre.findById.mockResolvedValue(mockOnboarding);
      (EmailService.sendOnboardingAssignmentEmail as jest.Mock).mockResolvedValue(undefined);

      const created = await userOnboardingService.create(createData, senderEmail, senderName);
      expect(created.id).toBe(1);
      expect(EmailService.sendOnboardingAssignmentEmail).toHaveBeenCalled();


      const updateData: UserOnboardingModel = { state: 1 };
      const currentRecord: UserOnboardingModel = { ...createData, id: 1 };

      mockUserOnboardingPostgre.findById.mockResolvedValue(currentRecord);
      mockUserOnboardingPostgre.update.mockResolvedValue(undefined);
      (EmailService.sendOnboardingUpdateEmail as jest.Mock).mockResolvedValue(undefined);

      const updated = await userOnboardingService.update(updateData, 1, senderEmail, senderName);
      expect(updated.state).toBe(1);
      expect(EmailService.sendOnboardingUpdateEmail).toHaveBeenCalled();


      mockUserOnboardingPostgre.getAll.mockResolvedValue([currentRecord]);
      mockUserOnboardingPostgre.delete.mockResolvedValue(1);
      (EmailService.sendOnboardingRemovalEmail as jest.Mock).mockResolvedValue(undefined);

      const deletedId = await userOnboardingService.delete(1, senderEmail, senderName);
      expect(deletedId).toBe(1);
      expect(EmailService.sendOnboardingRemovalEmail).toHaveBeenCalled();
    });
  });
});
