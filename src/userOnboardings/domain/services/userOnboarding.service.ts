import UserOnboardingPostgreSql from '../../infra/userOnboarding.postgresql';
import UserOnboardingModel from '../models/userOnboarding.model';
import UserPostgreSql from '../../../users/infra/user.postgresql';
import OnboardingPostgreSql from '../../../onboardings/infra/onboarding.postgresql';
import { EmailService } from '../../../shared/email/email.service';

export default class UserOnboardingService {
  public constructor(
    private userOnboardingPostgre: UserOnboardingPostgreSql,
    private userPostgre?: UserPostgreSql,
    private onboardingPostgre?: OnboardingPostgreSql
  ) {
    this.userPostgre = userPostgre || new UserPostgreSql();
    this.onboardingPostgre = onboardingPostgre || new OnboardingPostgreSql();
  }

  public async create(data: UserOnboardingModel, senderEmail?: string, senderName?: string): Promise<UserOnboardingModel> {
    const createdUserOnboarding: number = await this.userOnboardingPostgre.create(data);

    if (senderEmail && senderName && data.user_id && data.onboarding_id) {
      try {
        const assignedUser = await this.userPostgre!.findById(data.user_id);
        const onboarding = await this.onboardingPostgre!.findById(data.onboarding_id);

        if (assignedUser && onboarding) {
          await EmailService.sendOnboardingAssignmentEmail(
            assignedUser.email!,
            assignedUser.name!,
            senderEmail,
            senderName,
            onboarding.name!,
            onboarding.description || 'Sin descripción'
          );
        }
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }

    return { ...data, id: createdUserOnboarding };
  }

  public async update(data: UserOnboardingModel, id: number, senderEmail?: string, senderName?: string): Promise<UserOnboardingModel> {
    if (senderEmail && senderName) {
      try {
        const currentRecord = await this.userOnboardingPostgre.findById(id);

        if (currentRecord && currentRecord.user_id && currentRecord.onboarding_id) {
          await this.userOnboardingPostgre.update(data, id);

          const assignedUser = await this.userPostgre!.findById(currentRecord.user_id);
          const onboarding = await this.onboardingPostgre!.findById(currentRecord.onboarding_id);

          if (assignedUser && assignedUser.email && onboarding) {
            const stateText = this.getStateText(data.state || 0);
            await EmailService.sendOnboardingUpdateEmail(
              assignedUser.email,
              assignedUser.name || assignedUser.email.split('@')[0],
              senderEmail,
              senderName,
              onboarding.name!,
              onboarding.description || 'Sin descripción',
              stateText
            );
          }
        } else {
          await this.userOnboardingPostgre.update(data, id);
        }
      } catch (error) {
        console.error('Error sending update email:', error);
        await this.userOnboardingPostgre.update(data, id);
      }
    } else {
      await this.userOnboardingPostgre.update(data, id);
    }

    return { ...data, id };
  }

  public async updateUserOnboardingByUserAndOnboarding(
    data: UserOnboardingModel,
    user_id: number,
    onboarding_id: number,
    senderEmail?: string,
    senderName?: string
  ): Promise<UserOnboardingModel> {
    await this.userOnboardingPostgre.updateUserOnboardingByUserAndOnboarding(data, user_id, onboarding_id);

    if (senderEmail && senderName) {
      try {
        const assignedUser = await this.userPostgre!.findById(user_id);
        const onboarding = await this.onboardingPostgre!.findById(onboarding_id);

        if (assignedUser && assignedUser.email && onboarding) {
          const stateText = this.getStateText(data.state || 0);
          await EmailService.sendOnboardingUpdateEmail(
            assignedUser.email,
            assignedUser.name || assignedUser.email.split('@')[0],
            senderEmail,
            senderName,
            onboarding.name!,
            onboarding.description || 'Sin descripción',
            stateText
          );
        }
      } catch (error) {
        console.error('Error sending update email:', error);
      }
    }

    return { ...data, user_id, onboarding_id };
  }

  private getStateText(state: number): string {
    const states: { [key: number]: string } = {
      0: 'En progreso',
      1: 'Completado',
    };
    return states[state] || 'Desconocido';
  }

  public async getAll(user_id: number | undefined): Promise<UserOnboardingModel[]> {
    const userOnboardings: UserOnboardingModel[] = await this.userOnboardingPostgre.getAll(user_id);
    return userOnboardings;
  }

  public async delete(userOnboardingId: number, senderEmail?: string, senderName?: string): Promise<number> {
    if (senderEmail && senderName) {
      try {
        const currentRecord = await this.userOnboardingPostgre.findById(userOnboardingId);

        if (currentRecord && currentRecord.user_id && currentRecord.onboarding_id) {
          const assignedUser = await this.userPostgre!.findById(currentRecord.user_id);
          const onboarding = await this.onboardingPostgre!.findById(currentRecord.onboarding_id);

          const allUserOnboardings = await this.userOnboardingPostgre.getAll(undefined);
          const usersInOnboarding = allUserOnboardings.filter(uo => uo.onboarding_id === currentRecord.onboarding_id);

          const deletedUserOnboarding: number = await this.userOnboardingPostgre.delete(userOnboardingId);


          if (onboarding && usersInOnboarding.length > 0) {
            const emailPromises = usersInOnboarding.map(async (userOnboarding) => {
              if (userOnboarding.user_id) {
                try {
                  const user = await this.userPostgre!.findById(userOnboarding.user_id);
                  if (user && user.email) {
                    await EmailService.sendOnboardingRemovalEmail(
                      user.email,
                      user.name || user.email.split('@')[0],
                      senderEmail,
                      senderName,
                      onboarding.name!,
                      onboarding.description || 'Sin descripción'
                    );
                  }
                } catch (error) {
                  console.error(`Error enviando email al usuario ${userOnboarding.user_id}:`, error);
                }
              }
            });

            await Promise.all(emailPromises);
          }

          return deletedUserOnboarding;
        } else {

          const deletedUserOnboarding: number = await this.userOnboardingPostgre.delete(userOnboardingId);
          return deletedUserOnboarding;
        }
      } catch (error) {
        console.error('Error in delete process:', error);
        throw error;
      }
    } else {

      const deletedUserOnboarding: number = await this.userOnboardingPostgre.delete(userOnboardingId);
      return deletedUserOnboarding;
    }
  }

  public async deleteUserOnboardingByUserAndOnboarding(
    user_id: number,
    onboarding_id: number,
    senderEmail?: string,
    senderName?: string
  ): Promise<number> {

    if (senderEmail && senderName) {
      try {
        const assignedUser = await this.userPostgre!.findById(user_id);
        const onboarding = await this.onboardingPostgre!.findById(onboarding_id);

        const deletedUserOnboarding: number = await this.userOnboardingPostgre.deleteUserOnboardingByUserAndOnboarding(user_id, onboarding_id);


        if (assignedUser && assignedUser.email && onboarding) {
          await EmailService.sendOnboardingRemovalEmail(
            assignedUser.email,
            assignedUser.name || assignedUser.email.split('@')[0],
            senderEmail,
            senderName,
            onboarding.name!,
            onboarding.description || 'Sin descripción'
          );
        }

        return deletedUserOnboarding;
      } catch (error) {
        console.error('Error in delete process:', error);
        throw error;
      }
    } else {
      const deletedUserOnboarding: number = await this.userOnboardingPostgre.deleteUserOnboardingByUserAndOnboarding(user_id, onboarding_id);
      return deletedUserOnboarding;
    }
  }
}
