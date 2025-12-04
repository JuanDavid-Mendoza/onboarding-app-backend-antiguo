import Mapper from "../../shared/mappers/mapper";
import OnboardingDto from "../domain/dto/onboarding.dto";
import OnboardingModel from "../domain/models/onboarding.model";
import OnboardingService from "../domain/services/onboarding.service";
import OnboardingPostgreSql from "../infra/onboarding.postgresql";

export default class OnboardingApp {
  public async create(data: OnboardingModel): Promise<OnboardingModel> {
    const onboardingService: OnboardingService = new OnboardingService(new OnboardingPostgreSql());
    const onboarding = await onboardingService.create(data)
    return Mapper.mapToClass(OnboardingDto, onboarding);
  }

  public async update(data: OnboardingModel, id: number, senderEmail?: string, senderName?: string): Promise<OnboardingModel> {
    const onboardingService: OnboardingService = new OnboardingService(new OnboardingPostgreSql());
    const onboarding = await onboardingService.update(data, id, senderEmail, senderName);
    return Mapper.mapToClass(OnboardingDto, onboarding);
  }

  public async getAll(): Promise<OnboardingDto[]> {
    const onboardingService: OnboardingService = new OnboardingService(new OnboardingPostgreSql());
    const onboardings: OnboardingModel[] = await onboardingService.getAll();
    return Mapper.mapArrayToClass(OnboardingDto, onboardings);
  }

  public async delete(onboardingId: number, senderEmail?: string, senderName?: string): Promise<number> {
    const onboardingService: OnboardingService = new OnboardingService(new OnboardingPostgreSql());
    return onboardingService.delete(onboardingId, senderEmail, senderName);
  }
}
