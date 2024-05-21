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
      ...(user.profile && ({profile: {
        id: user.profile.id,
        name: user.profile.name,
        company_id: user.profile.company_id,
        ...(user.profile.company && ({company: {
          id: user.profile.company.id,
          name: user.profile.company.name,
          cnpj: user.profile.company.cnpj,
          telephone: user.profile.company.telephone,
          client_identifier: user.profile.company.client_identifier,
          created_at: user.profile.company.created_at,
          updated_at: user.profile.company.updated_at,
          unities: user.profile.company.unities.map(unity => ({
            id: unity.id,
            name: unity.name,
            company_id: unity.company_id,
            created_at: unity.created_at,
            updated_at: unity.updated_at,
          })),
        }})),
        user_id: user.profile.user_id,
        unit_id: user.profile.unit_id,
        ...(user.profile.unit && ({
          unit: {
            id: user.profile.unit.id,
            name: user.profile.unit.name,
            telephone: user.profile.unit.telephone,
            client_identifier: user.profile.unit.client_identifier,
            company_id: user.profile.unit.company_id,
            created_at: user.profile.unit.created_at,
            updated_at: user.profile.unit.updated_at,
          }
        })),
        updated_at: user.profile.updated_at,
        created_at: user.profile.created_at,
      }})),
      updated_at: user.updated_at,
      created_at: user.created_at,
    };
  }
}
