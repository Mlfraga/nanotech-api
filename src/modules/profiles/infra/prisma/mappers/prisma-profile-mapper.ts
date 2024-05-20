import { Company } from '@modules/companies/infra/entities/Company';
import ICreateProfileDTO from '@modules/profiles/dtos/ICreateProfileDTO';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { User } from '@modules/users/infra/entities/User';
import { Prisma } from '@prisma/client';
import { Profile } from '../../entities/Profile';

export type PrismaProfile = Prisma.profilesGetPayload<{
  include: {
    unities: true;
    users: true;
    companies: true;
  };
}>;

export class PrismaProfileMapper {
  static toPrisma(profile: ICreateProfileDTO) {
    return {
      company_id: profile.company_id,
      name: profile.name,
      unit_id: profile.unit_id,
      user_id: profile.user_id,
    };
  }

  static toDomain(raw: PrismaProfile) {
    return new Profile(
      {
        name: raw.name,
        user_id: raw.user_id,
        user: new User({
          enabled: raw.users.enabled,
          first_login: raw.users.first_login,
          role: raw.users.role,
          telephone: raw.users.telephone,
          username: raw.users.username,
          password: raw.users.password,
          email: raw.users.email,
          pix_key: raw.users.pix_key ?? undefined,
          pix_key_type: raw.users.pix_key_type ?? undefined,
          created_at: raw.users.created_at,
          updated_at: raw.users.updated_at,
        }, raw.users.id),
        company_id: raw.company_id ?? undefined,
        company: !raw.companies ? undefined : new Company({
          name: raw.companies.name,
          created_at: raw.companies.created_at,
          updated_at: raw.companies.updated_at,
          cnpj: raw.companies.cnpj,
          client_identifier: raw.companies.client_identifier,
          telephone: raw.companies.telephone,
          unities: [],
        }, raw.companies.id),
        unit_id: raw.unit_id ?? undefined,
        unit: !raw.unities ? undefined : new Unit({
          name: raw.unities.name,
          created_at: raw.unities.created_at,
          updated_at: raw.unities.updated_at,
          client_identifier: raw.unities.client_identifier,
          telephone: raw.unities.telephone,
          company_id: raw.unities.company_id,
        }, raw.unities.id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      raw.id,
    );
  }
}
