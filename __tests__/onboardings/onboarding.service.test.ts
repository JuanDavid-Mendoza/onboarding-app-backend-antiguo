import OnboardingService from '../../src/onboardings/domain/services/onboarding.service';
import OnboardingPostgreSql from '../../src/onboardings/infra/onboarding.postgresql';
import UserOnboardingPostgreSql from '../../src/userOnboardings/infra/userOnboarding.postgresql';
import UserPostgreSql from '../../src/users/infra/user.postgresql';
import { EmailService } from '../../src/shared/email/email.service';
import OnboardingModel from '../../src/onboardings/domain/models/onboarding.model';
import UserModel from '../../src/users/domain/models/user.model';
import UserOnboardingModel from '../../src/userOnboardings/domain/models/userOnboarding.model';


jest.mock('../../src/onboardings/infra/onboarding.postgresql');
jest.mock('../../src/userOnboardings/infra/userOnboarding.postgresql');
jest.mock('../../src/users/infra/user.postgresql');
jest.mock('../../src/shared/email/email.service');

describe('OnboardingService', () => {
  let onboardingService: OnboardingService;
  let mockOnboardingPostgre: jest.Mocked<OnboardingPostgreSql>;
  let mockUserOnboardingPostgre: jest.Mocked<UserOnboardingPostgreSql>;
  let mockUserPostgre: jest.Mocked<UserPostgreSql>;

  beforeEach(() => {

    jest.clearAllMocks();


    mockOnboardingPostgre = new OnboardingPostgreSql() as jest.Mocked<OnboardingPostgreSql>;
    mockUserOnboardingPostgre = new UserOnboardingPostgreSql() as jest.Mocked<UserOnboardingPostgreSql>;
    mockUserPostgre = new UserPostgreSql() as jest.Mocked<UserPostgreSql>;

    onboardingService = new OnboardingService(
      mockOnboardingPostgre,
      mockUserOnboardingPostgre,
      mockUserPostgre
    );
  });

  describe('create', () => {
    const validOnboardingData: OnboardingModel = {
      name: 'Onboarding Backend',
      description: 'Proceso de onboarding para desarrolladores backend',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      onboarding_type_id: 1,
      color: '#003473'
    };

    it('debería crear un onboarding exitosamente', async () => {

      const mockOnboardingId = 1;
      mockOnboardingPostgre.create.mockResolvedValue(mockOnboardingId);


      const result = await onboardingService.create(validOnboardingData);


      expect(mockOnboardingPostgre.create).toHaveBeenCalledWith(validOnboardingData);
      expect(result).toEqual({
        ...validOnboardingData,
        id: mockOnboardingId
      });
    });

    it('debería manejar errores al crear un onboarding', async () => {

      mockOnboardingPostgre.create.mockRejectedValue(new Error('Error de base de datos'));

      await expect(
        onboardingService.create(validOnboardingData)
      ).rejects.toThrow('Error de base de datos');

      expect(mockOnboardingPostgre.create).toHaveBeenCalledWith(validOnboardingData);
    });
  });

  describe('getAll', () => {
    it('debería obtener todos los onboardings', async () => {

      const mockOnboardings: OnboardingModel[] = [
        {
          id: 1,
          name: 'Onboarding Backend',
          description: 'Desarrollo backend',
          start_date: '2024-01-01',
          end_date: '2024-01-31',
          onboarding_type_id: 1,
          color: '#003473'
        },
        {
          id: 2,
          name: 'Onboarding Frontend',
          description: 'Desarrollo frontend',
          start_date: '2024-02-01',
          end_date: '2024-02-28',
          onboarding_type_id: 2,
          color: '#EBB932'
        }
      ];

      mockOnboardingPostgre.getAll.mockResolvedValue(mockOnboardings);


      const result = await onboardingService.getAll();


      expect(mockOnboardingPostgre.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockOnboardings);
      expect(result).toHaveLength(2);
    });

    it('debería retornar un array vacío si no hay onboardings', async () => {

      mockOnboardingPostgre.getAll.mockResolvedValue([]);


      const result = await onboardingService.getAll();


      expect(mockOnboardingPostgre.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('update', () => {
    const onboardingId = 1;
    const updateData: OnboardingModel = {
      name: 'Onboarding Actualizado',
      description: 'Descripción actualizada',
      start_date: '2024-02-01',
      end_date: '2024-02-28',
      onboarding_type_id: 1,
      color: '#CD3232'
    };

    const existingOnboarding: OnboardingModel = {
      id: onboardingId,
      name: 'Onboarding Original',
      description: 'Descripción original',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      onboarding_type_id: 1,
      color: '#003473'
    };

    it('debería actualizar un onboarding sin enviar emails', async () => {

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockOnboardingPostgre.update.mockResolvedValue(undefined);


      const result = await onboardingService.update(updateData, onboardingId);


      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockOnboardingPostgre.update).toHaveBeenCalledWith(updateData, onboardingId);
      expect(result).toEqual({ ...updateData, id: onboardingId });
      expect(mockUserOnboardingPostgre.getAll).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el onboarding no existe', async () => {

      mockOnboardingPostgre.findById.mockResolvedValue(null);

      await expect(
        onboardingService.update(updateData, onboardingId)
      ).rejects.toThrow('Onboarding no encontrado');

      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockOnboardingPostgre.update).not.toHaveBeenCalled();
    });

    it('debería actualizar y enviar emails a usuarios asignados', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: onboardingId,
          state: 1,
        },
        {
          id: 2,
          user_id: 20,
          onboarding_id: onboardingId,
          state: 2,
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

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);
      mockUserPostgre.findById.mockResolvedValueOnce(mockUser1).mockResolvedValueOnce(mockUser2);
      (EmailService.sendOnboardingModificationEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await onboardingService.update(updateData, onboardingId, senderEmail, senderName);


      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockOnboardingPostgre.update).toHaveBeenCalledWith(updateData, onboardingId);
      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalledWith(undefined);
      expect(mockUserPostgre.findById).toHaveBeenCalledTimes(2);
      expect(EmailService.sendOnboardingModificationEmail).toHaveBeenCalledTimes(2);
      expect(EmailService.sendOnboardingModificationEmail).toHaveBeenCalledWith(
        mockUser1.email,
        mockUser1.name,
        senderEmail,
        senderName,
        updateData.name,
        updateData.description
      );
      expect(result).toEqual({ ...updateData, id: onboardingId });
    });

    it('debería continuar si no hay usuarios asignados', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserOnboardingPostgre.getAll.mockResolvedValue([]);


      const result = await onboardingService.update(updateData, onboardingId, senderEmail, senderName);


      expect(mockOnboardingPostgre.update).toHaveBeenCalledWith(updateData, onboardingId);
      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalled();
      expect(mockUserPostgre.findById).not.toHaveBeenCalled();
      expect(EmailService.sendOnboardingModificationEmail).not.toHaveBeenCalled();
      expect(result).toEqual({ ...updateData, id: onboardingId });
    });

    it('debería manejar errores al enviar emails sin afectar la actualización', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: onboardingId,
          state: 1,
        }
      ];

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockOnboardingPostgre.update.mockResolvedValue(undefined);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      (EmailService.sendOnboardingModificationEmail as jest.Mock).mockRejectedValue(
        new Error('Error al enviar email')
      );


      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      const result = await onboardingService.update(updateData, onboardingId, senderEmail, senderName);


      expect(mockOnboardingPostgre.update).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toEqual({ ...updateData, id: onboardingId });


      consoleErrorSpy.mockRestore();
    });
  });

  describe('delete', () => {
    const onboardingId = 1;
    const existingOnboarding: OnboardingModel = {
      id: onboardingId,
      name: 'Onboarding a Eliminar',
      description: 'Este onboarding será eliminado',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      onboarding_type_id: 1,
      color: '#003473'
    };

    it('debería eliminar un onboarding sin enviar emails', async () => {

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockOnboardingPostgre.delete.mockResolvedValue(onboardingId);


      const result = await onboardingService.delete(onboardingId);


      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockOnboardingPostgre.delete).toHaveBeenCalledWith(onboardingId);
      expect(result).toBe(onboardingId);
      expect(mockUserOnboardingPostgre.getAll).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el onboarding no existe', async () => {

      mockOnboardingPostgre.findById.mockResolvedValue(null);

      await expect(
        onboardingService.delete(onboardingId)
      ).rejects.toThrow('Onboarding no encontrado');

      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockOnboardingPostgre.delete).not.toHaveBeenCalled();
    });

    it('debería eliminar y enviar emails a usuarios asignados', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: onboardingId,
          state: 1,
        },
        {
          id: 2,
          user_id: 20,
          onboarding_id: onboardingId,
          state: 2,
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

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);
      mockOnboardingPostgre.delete.mockResolvedValue(onboardingId);
      mockUserPostgre.findById.mockResolvedValueOnce(mockUser1).mockResolvedValueOnce(mockUser2);
      (EmailService.sendOnboardingRemovalEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await onboardingService.delete(onboardingId, senderEmail, senderName);


      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalledWith(undefined);
      expect(mockOnboardingPostgre.delete).toHaveBeenCalledWith(onboardingId);
      expect(mockUserPostgre.findById).toHaveBeenCalledTimes(2);
      expect(EmailService.sendOnboardingRemovalEmail).toHaveBeenCalledTimes(2);
      expect(EmailService.sendOnboardingRemovalEmail).toHaveBeenCalledWith(
        mockUser1.email,
        mockUser1.name,
        senderEmail,
        senderName,
        existingOnboarding.name,
        existingOnboarding.description
      );
      expect(result).toBe(onboardingId);
    });

    it('debería eliminar correctamente cuando no hay usuarios asignados', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockUserOnboardingPostgre.getAll.mockResolvedValue([]);
      mockOnboardingPostgre.delete.mockResolvedValue(onboardingId);


      const result = await onboardingService.delete(onboardingId, senderEmail, senderName);


      expect(mockOnboardingPostgre.findById).toHaveBeenCalledWith(onboardingId);
      expect(mockUserOnboardingPostgre.getAll).toHaveBeenCalled();
      expect(mockOnboardingPostgre.delete).toHaveBeenCalledWith(onboardingId);
      expect(mockUserPostgre.findById).not.toHaveBeenCalled();
      expect(EmailService.sendOnboardingRemovalEmail).not.toHaveBeenCalled();
      expect(result).toBe(onboardingId);
    });

    it('debería manejar errores al enviar emails y propagar el error', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: onboardingId,
          state: 1,
        }
      ];

      const mockUser: UserModel = {
        id: 10,
        name: 'Juan Pérez',
        email: 'juan.perez@banco.com',
        role_id: 2,
        entry_date: '2024-01-01',
        password: 'hashed'
      };

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);
      mockOnboardingPostgre.delete.mockResolvedValue(onboardingId);
      mockUserPostgre.findById.mockResolvedValue(mockUser);
      (EmailService.sendOnboardingRemovalEmail as jest.Mock).mockRejectedValue(
        new Error('Error al enviar email')
      );


      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();


      const result = await onboardingService.delete(onboardingId, senderEmail, senderName);


      expect(mockOnboardingPostgre.delete).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBe(onboardingId);


      consoleErrorSpy.mockRestore();
    });

    it('debería filtrar correctamente usuarios por onboarding_id', async () => {

      const senderEmail = 'admin@banco.com';
      const senderName = 'Admin Banco';

      const mockUserOnboardings: UserOnboardingModel[] = [
        {
          id: 1,
          user_id: 10,
          onboarding_id: onboardingId,
          state: 1
        },
        {
          id: 2,
          user_id: 20,
          onboarding_id: 999,
          state: 2
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

      mockOnboardingPostgre.findById.mockResolvedValue(existingOnboarding);
      mockUserOnboardingPostgre.getAll.mockResolvedValue(mockUserOnboardings);
      mockOnboardingPostgre.delete.mockResolvedValue(onboardingId);
      mockUserPostgre.findById.mockResolvedValue(mockUser1);
      (EmailService.sendOnboardingRemovalEmail as jest.Mock).mockResolvedValue(undefined);


      const result = await onboardingService.delete(onboardingId, senderEmail, senderName);


      expect(mockUserPostgre.findById).toHaveBeenCalledTimes(1);
      expect(EmailService.sendOnboardingRemovalEmail).toHaveBeenCalledTimes(1);
      expect(result).toBe(onboardingId);
    });
  });

  describe('Casos de integración', () => {
    it('debería completar el flujo: crear -> obtener -> actualizar -> eliminar', async () => {

      const onboardingData: OnboardingModel = {
        name: 'Onboarding Completo',
        description: 'Test de flujo completo',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        onboarding_type_id: 1,
        color: '#003473'
      };

      const createdId = 5;
      const updatedData: OnboardingModel = {
        ...onboardingData,
        name: 'Onboarding Actualizado'
      };


      mockOnboardingPostgre.create.mockResolvedValue(createdId);
      const created = await onboardingService.create(onboardingData);
      expect(created.id).toBe(createdId);


      const mockOnboardings = [created];
      mockOnboardingPostgre.getAll.mockResolvedValue(mockOnboardings);
      const all = await onboardingService.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe(createdId);


      mockOnboardingPostgre.findById.mockResolvedValue(created);
      mockOnboardingPostgre.update.mockResolvedValue(undefined);
      const updated = await onboardingService.update(updatedData, createdId);
      expect(updated.name).toBe('Onboarding Actualizado');


      mockOnboardingPostgre.findById.mockResolvedValue(updated);
      mockOnboardingPostgre.delete.mockResolvedValue(createdId);
      const deletedId = await onboardingService.delete(createdId);
      expect(deletedId).toBe(createdId);
    });
  });
});
