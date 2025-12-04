import DBConnection from '../../shared/postgre/db.postgre';
import UserOnboardingModel from '../domain/models/userOnboarding.model';

export default class UserOnboardingPostgreSql {
  async create(data: UserOnboardingModel): Promise<number> {
    const createdUserOnboarding = await DBConnection.getInstance().insertRecord('user_onboarding', data);
    return Number(createdUserOnboarding.id);
  }

  async update(data: UserOnboardingModel, id: number): Promise<number> {
    await DBConnection.getInstance().updateRecord('user_onboarding', id, data);
    return id;
  }

  async updateUserOnboardingByUserAndOnboarding(data: UserOnboardingModel, user_id: number, onboarding_id: number): Promise<number> {
    if (typeof data.state !== "number" || typeof user_id !== "number" || typeof onboarding_id !== "number") {
      throw new Error("Invalid values");
    }

    await DBConnection.getInstance().executeQuery(
      'UPDATE user_onboarding SET state = $1, updated_at = now() WHERE user_id = $2 AND onboarding_id = $3',
      [data.state, user_id, onboarding_id]);
    return user_id;
  }

  async getAll(user_id: number | undefined): Promise<UserOnboardingModel[]> {
    const auxWhere = user_id ? ` WHERE uo.user_id = $1 ` : '';
    const params = user_id ? [user_id] : [];

    const userOnboardings: UserOnboardingModel[] = await DBConnection.getInstance().executeQuery(
      `SELECT uo.*, o.name, o.start_date, o.end_date, o.color, o.id, ot.name as onboarding_type
        FROM "user_onboarding" uo 
        JOIN "onboarding" o ON uo.onboarding_id = o.id 
        JOIN "onboarding_type" ot ON o.onboarding_type_id = ot.id
        ${auxWhere}`, params
    );

    return userOnboardings;
  }

  async delete(id: number): Promise<number> {
    await DBConnection.getInstance().deleteRecord('user_onboarding', id);
    return id;
  }

  async deleteUserOnboardingByUserAndOnboarding(user_id: number, onboarding_id: number): Promise<number> {
    if (typeof user_id !== "number" || typeof onboarding_id !== "number") {
      throw new Error("Invalid values");
    }
    await DBConnection.getInstance().executeQuery(
      'DELETE FROM user_onboarding WHERE user_id = $1 AND onboarding_id = $2',
      [user_id, onboarding_id]
    );
    return user_id;
  }

  async findById(id: number): Promise<UserOnboardingModel> {
    const userOnboarding = await DBConnection.getInstance().executeQuery(
      'SELECT * FROM user_onboarding WHERE id = $1 LIMIT 1',
      [id]
    );
    return userOnboarding[0];
  }
}
