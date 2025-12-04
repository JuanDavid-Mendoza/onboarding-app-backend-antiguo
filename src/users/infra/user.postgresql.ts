import DBConnection from '../../shared/postgre/db.postgre';
import UserModel from '../domain/models/user.model';

export default class UserPostgreSql {
  async create(data: UserModel): Promise<number> {
    const createdUser = await DBConnection.getInstance().insertRecord('user', data);
    return Number(createdUser.id);
  }

  async update(data: UserModel, id: number): Promise<number> {
    await DBConnection.getInstance().updateRecord('user', id, data);
    return id;
  }

  async getAll(): Promise<UserModel[]> {
    const users: UserModel[] = await DBConnection.getInstance().executeQuery(
      `SELECT u.*, r.name as role_name FROM "user" u JOIN role r ON u.role_id = r.id`
    );

    return users;
  }

  async delete(id: number): Promise<number> {
    await DBConnection.getInstance().executeQuery(`DELETE FROM "user_onboarding" WHERE user_id = $1`, [id]);
    await DBConnection.getInstance().deleteRecord('user', id);
    return id;
  }

  async findByEmail(email: string): Promise<UserModel> {
    const user = await DBConnection.getInstance().executeQuery(
      `SELECT * FROM "user" WHERE email = $1 LIMIT 1`, [email]
    );

    return user[0];
  }

  async findById(id: number): Promise<UserModel> {
    const user = await DBConnection.getInstance().executeQuery(
      `SELECT * FROM "user" WHERE id = $1 LIMIT 1`, [id]
    );

    return user[0];
  }
}
