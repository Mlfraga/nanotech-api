import Profile from '../../typeorm/entities/Profile';

export class ProfileViewModel {
  static toHttp(profile: Profile) {
    return {
      id: profile.id,
      name: profile.name,
      company_id: profile.company_id,
      user_id: profile.user_id,
      ...(profile.company && {
        company: {
          id: profile.company.id,
          name: profile.company.name,
          cnpj: profile.company.cnpj,
          telephone: profile.company.telephone,
          client_identifier: profile.company.client_identifier,
        },
      }),
      ...(profile.user && {
        user: {
          id: profile.user.id,
          email: profile.user.email,
          telephone: profile.user.telephone,
          username: profile.user.username,
          role: profile.user.role,
          enabled: profile.user.enabled,
        },
      }),
    };
  }
}
