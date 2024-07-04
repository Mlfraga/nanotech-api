
import { Prisma } from '@prisma/client';
import { User } from '../../entities/User';
import { Profile } from '@modules/profiles/infra/entities/Profile';
import { Company } from '@modules/companies/infra/entities/Company';

export type PrismaUsersProvider = Prisma.usersGetPayload<{
  include: {
    profiles: {
      include: {
        companies: true,
      }
    }
  }
}>;

export class PrismaUserMapper {
  static toPrisma(user: User) {
    return {
      email: user.email,
      username: user.username,
      telephone: user.telephone,
      password: user.password,
      role: user.role,
      first_login: user.first_login,
      enabled: user.enabled,
      pix_key: user.pix_key,
      pix_key_type: user.pix_key_type,
    };
  }

  static toDomain(raw: PrismaUsersProvider) {
    return new User({
      enabled: raw.enabled,
      first_login: raw.first_login,
      password: raw.password,
      email: raw.email,
      pix_key: raw.pix_key ?? undefined,
      pix_key_type: raw.pix_key_type ?? undefined,
      role: raw.role,
      username: raw.username,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      telephone: raw.telephone,
      ...(raw.profiles && ({
        profile: new Profile({
          name: raw.profiles.name,
          user_id: raw.profiles.user_id,
          user: {} as User,
          company_id: raw.profiles.company_id ?? undefined,
          created_at: raw.profiles.created_at,
          unit_id: raw.profiles.unit_id ?? undefined,
          updated_at: raw.profiles.updated_at,
          ...(raw.profiles.companies && {company: new Company({
            name: raw.profiles.companies.name,
            cnpj: raw.profiles.companies.cnpj,
            client_identifier: raw.profiles.companies.client_identifier,
            unities: [],
            created_at: raw.profiles.companies.created_at,
            updated_at: raw.profiles.companies.updated_at,
            telephone: raw.profiles.companies.telephone,
          }, raw.profiles.companies.id)}),
        }, raw.profiles.id)
      })),
    }, raw.id);
  }
}
