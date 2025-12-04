import Mapper from "../../shared/mappers/mapper";
import UserDto from "../domain/dto/user.dto";
import UserModel from "../domain/models/user.model";
import UserService from "../domain/services/user.service";
import UserPostgreSql from "../infra/user.postgresql";

export default class UserApp {
  public async create(data: UserModel): Promise<UserDto> {
    const userService: UserService = new UserService(new UserPostgreSql());
    const user = await userService.create(data)
    return Mapper.mapToClass(UserDto, user);
  }

  public async update(data: UserModel, id: number): Promise<UserDto> {
    const userService: UserService = new UserService(new UserPostgreSql());
    const user = await userService.update(data, id)
    return Mapper.mapToClass(UserDto, user);
  }

  public async getAll(): Promise<UserDto[]> {
    const userService: UserService = new UserService(new UserPostgreSql());
    const users: UserModel[] = await userService.getAll();
    return Mapper.mapArrayToClass(UserDto, users);
  }
  
  public async delete(userId: number): Promise<number> {
    const userService: UserService = new UserService(new UserPostgreSql());
    return userService.delete(userId);
  }
}
