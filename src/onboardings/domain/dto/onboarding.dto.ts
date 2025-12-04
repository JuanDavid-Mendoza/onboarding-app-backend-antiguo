
export default class OnboardingDto {
  id?: number | null = null;
  name: string | null = null;
  description: string | null = null;
  start_date: string | null = null;
  end_date: string | null = null;
  onboarding_type_id: number | null = null;
  onboarding_type?: string | null = null;
  color: string | null = null;
  created_at?: string | null = null;
  updated_at?: string | null = null;
}
