import DBConnection from '../../shared/postgre/db.postgre';
import OnboardingModel from '../domain/models/onboarding.model';

export default class OnboardingPostgreSql {
  async create(data: OnboardingModel): Promise<number> {
    const createdOnboarding = await DBConnection.getInstance().insertRecord('onboarding', data);
    return Number(createdOnboarding.id);
  }

  async update(data: OnboardingModel, id: number): Promise<number> {
    await DBConnection.getInstance().updateRecord('onboarding', id, data);
    return id;
  }

  async getAll(): Promise<OnboardingModel[]> {
    const onboardings: OnboardingModel[] = await DBConnection.getInstance().executeQuery(
      `SELECT o.*, ot.name as onboarding_type FROM "onboarding" o JOIN onboarding_type ot ON o.onboarding_type_id = ot.id`
    );

    return onboardings;
  }

  async delete(id: number): Promise<number> {
    await DBConnection.getInstance().executeQuery(`DELETE FROM "user_onboarding" WHERE onboarding_id = $1`, [id]);
    await DBConnection.getInstance().deleteRecord('onboarding', id);
    return id;
  }

  async findById(id: number): Promise<OnboardingModel> {
    const onboarding = await DBConnection.getInstance().executeQuery(
      `SELECT o.*, ot.name as onboarding_type FROM "onboarding" o JOIN onboarding_type ot ON o.onboarding_type_id = ot.id WHERE o.id = $1 LIMIT 1`,
      [id]
    );

    return onboarding[0];
  }
}
