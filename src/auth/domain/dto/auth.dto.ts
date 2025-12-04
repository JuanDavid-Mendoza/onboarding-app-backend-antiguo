
export default class AuthDto {
  message?: string | null = null;
  accessToken: string | null = null;
  refreshToken: string | null = null;
  user: User | null = null;
}

class User {
  id: number | null = null;
  name: string | null = null;
  email: string | null = null;
  role_id: number | null = null;
}

