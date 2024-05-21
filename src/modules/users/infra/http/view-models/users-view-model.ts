import { User } from '../../entities/User';

export class UsersViewModel {
  static toHttp(user: User) {
    return {
      id: user.id,
      telephone: user.telephone,
      username: user.username,
      email: user.email,
      pix_key_type: user.pix_key_type,
      pix_key: user.pix_key,
      password: user.password,
      role: user.role,
      first_login: user.first_login,
      enabled: user.enabled,
      profile: user.profile,
      updated_at: user.updated_at,
      created_at: user.created_at,
    };
  }
}
