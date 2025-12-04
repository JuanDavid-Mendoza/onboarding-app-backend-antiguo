import OnboardingPostgreSql from '../../infra/onboarding.postgresql';
import OnboardingModel from '../models/onboarding.model';
import UserOnboardingPostgreSql from '../../../userOnboardings/infra/userOnboarding.postgresql';
import UserPostgreSql from '../../../users/infra/user.postgresql';
import { EmailService } from '../../../shared/email/email.service';

export default class OnboardingService {
  public constructor(
    private onboardingPostgre: OnboardingPostgreSql,
    private userOnboardingPostgre?: UserOnboardingPostgreSql,
    private userPostgre?: UserPostgreSql
  ) {
    this.userOnboardingPostgre = userOnboardingPostgre || new UserOnboardingPostgreSql();
    this.userPostgre = userPostgre || new UserPostgreSql();
  }

  public async create(data: OnboardingModel): Promise<OnboardingModel> {
    const createdOnboarding: number = await this.onboardingPostgre.create(data)
    return { ...data, id: createdOnboarding };
  }

  public async update(data: OnboardingModel, id: number, senderEmail?: string, senderName?: string): Promise<OnboardingModel> {

    const onboarding = await this.onboardingPostgre.findById(id);

    if (!onboarding) {
      throw new Error('Onboarding no encontrado');
    }


    await this.onboardingPostgre.update(data, id);
    if (senderEmail && senderName) {
      try {
        const userOnboardings = await this.userOnboardingPostgre!.getAll(undefined);
        const assignedUsers = userOnboardings.filter(uo => Number(uo.onboarding_id) === Number(id));

        if (assignedUsers.length > 0) {
          const emailPromises = assignedUsers.map(async (userOnboarding) => {
            if (userOnboarding.user_id) {
              try {
                const user = await this.userPostgre!.findById(Number(userOnboarding.user_id));
                if (user && user.email) {
                  await EmailService.sendOnboardingModificationEmail(
                    user.email,
                    user.name || user.email.split('@')[0],
                    senderEmail,
                    senderName,
                    data.name || onboarding.name!,
                    data.description || onboarding.description || 'Sin descripción'
                  );
                }
              } catch (error) {
                console.error(`Error enviando email al usuario ${userOnboarding.user_id}:`, error);
              }
            }
          });

          await Promise.all(emailPromises);

        }
      } catch (error) {
        console.error('Error enviando correos de modificación:', error);
      }
    }

    return { ...data, id };
  }

  public async getAll(): Promise<OnboardingModel[]> {
    const onboardings: OnboardingModel[] = await this.onboardingPostgre.getAll();
    return onboardings;
  }

  public async delete(onboardingId: number, senderEmail?: string, senderName?: string): Promise<number> {
    const onboarding = await this.onboardingPostgre.findById(onboardingId);

    if (!onboarding) {
      throw new Error('Onboarding no encontrado');
    }


    if (senderEmail && senderName) {
      try {
        const userOnboardings = await this.userOnboardingPostgre!.getAll(undefined);
        const assignedUsers = userOnboardings.filter(uo => Number(uo.onboarding_id) === Number(onboardingId));

        const deletedOnboarding: number = await this.onboardingPostgre.delete(onboardingId);

        if (assignedUsers.length > 0) {
          const emailPromises = assignedUsers.map(async (userOnboarding) => {
            if (userOnboarding.user_id) {
              try {
                const user = await this.userPostgre!.findById(Number(userOnboarding.user_id));
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

        return deletedOnboarding;
      } catch (error) {
        console.error('Error en el proceso de eliminación:', error);
        throw error;
      }
    } else {
      const deletedOnboarding: number = await this.onboardingPostgre.delete(onboardingId);
      return deletedOnboarding;
    }
  }
}
