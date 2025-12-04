import Mapper from "../../shared/mappers/mapper";
import UserOnboardingDto from "../domain/dto/userOnboarding.dto";
import UserOnboardingModel from "../domain/models/userOnboarding.model";
import UserOnboardingService from "../domain/services/userOnboarding.service";
import UserOnboardingPostgreSql from "../infra/userOnboarding.postgresql";

export default class UserOnboardingApp {
  public async create(data: UserOnboardingModel, senderEmail?: string, senderName?: string): Promise<UserOnboardingDto> {
    const userOnboardingService: UserOnboardingService = new UserOnboardingService(new UserOnboardingPostgreSql());
    const onboarding = await userOnboardingService.create(data, senderEmail, senderName);
    return Mapper.mapToClass(UserOnboardingDto, onboarding);
  }

  public async update(data: UserOnboardingModel, id: number, senderEmail?: string, senderName?: string): Promise<UserOnboardingDto> {
    const userOnboardingService: UserOnboardingService = new UserOnboardingService(new UserOnboardingPostgreSql());
    const onboarding = await userOnboardingService.update(data, id, senderEmail, senderName);
    return Mapper.mapToClass(UserOnboardingDto, onboarding);
  }

  public async updateUserOnboardingByUserAndOnboarding(
    data: UserOnboardingModel,
    user_id: number,
    onboarding_id: number,
    senderEmail?: string,
    senderName?: string
  ): Promise<UserOnboardingDto> {
    const userOnboardingService: UserOnboardingService = new UserOnboardingService(new UserOnboardingPostgreSql());
    const onboarding = await userOnboardingService.updateUserOnboardingByUserAndOnboarding(data, user_id, onboarding_id, senderEmail, senderName);
    return Mapper.mapToClass(UserOnboardingDto, onboarding);
  }

  public async getAll(user_id: number | undefined): Promise<UserOnboardingDto[]> {
    const userOnboardingService: UserOnboardingService = new UserOnboardingService(new UserOnboardingPostgreSql());
    const userOnboardings: UserOnboardingModel[] = await userOnboardingService.getAll(user_id);
    return Mapper.mapArrayToClass(UserOnboardingDto, userOnboardings);
  }

  public async delete(userOnboardingId: number, senderEmail?: string, senderName?: string): Promise<number> {
    const userOnboardingService: UserOnboardingService = new UserOnboardingService(new UserOnboardingPostgreSql());
    return userOnboardingService.delete(userOnboardingId, senderEmail, senderName);
  }

  public async deleteUserOnboardingByUserAndOnboarding(
    user_id: number,
    onboarding_id: number,
    senderEmail?: string,
    senderName?: string
  ): Promise<number> {
    const userOnboardingService: UserOnboardingService = new UserOnboardingService(new UserOnboardingPostgreSql());
    return userOnboardingService.deleteUserOnboardingByUserAndOnboarding(user_id, onboarding_id, senderEmail, senderName);
  }
}
