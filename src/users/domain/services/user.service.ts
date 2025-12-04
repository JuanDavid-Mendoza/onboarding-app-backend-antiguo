import { PasswordService } from '../../../shared/auth/password.service';
import UserPostgreSql from '../../infra/user.postgresql';
import UserModel from '../models/user.model';

export default class UserService {
  public constructor(private userPostgre: UserPostgreSql) {}

  public async create(data: UserModel): Promise<UserModel> {
    data.password = await PasswordService.hashPassword(data.password!);
    const createdUser: number = await this.userPostgre.create(data)
    return { ...data, id: createdUser };
  }

  public async update(data: UserModel, id: number): Promise<UserModel> {
    await this.userPostgre.update(data, id)
    return { ...data, id };
  }

  public async getAll(): Promise<UserModel[]> {
    const users: UserModel[] = await this.userPostgre.getAll();
    return users;
  }

  public async delete(userId: number): Promise<number> {
    const deletedUser: number = await this.userPostgre.delete(userId)
    return deletedUser;
  }
}
