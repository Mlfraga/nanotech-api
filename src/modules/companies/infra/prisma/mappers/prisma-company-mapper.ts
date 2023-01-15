import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { Prisma } from '@prisma/client';
import { Company } from '../../entities/Company';

export type PrismaCompany = Prisma.companiesGetPayload<{
  include: {
    unities: true;
  };
}>;

export class PrismaCompanyMapper {
  static toPrisma(company: ICreateCompanyDTO) {
    return {
      name: company.name,
      cnpj: company.cnpj,
      telephone: company.telephone,
      client_identifier: company.client_identifier,
    };
  }

  static toDomain(raw: PrismaCompany) {
    return new Company(
      {
        name: raw.name,
        unities: raw.unities.map(unit => {
          return new Unit({
            name: unit.name,
            client_identifier: unit.client_identifier,
            created_at: unit.created_at,
            updated_at: unit.updated_at,
            company_id: unit.company_id,
            telephone: unit.telephone,
          },
          unit.id,
          )
        }),
        cnpj: raw.cnpj,
        telephone: raw.telephone,
        client_identifier: raw.client_identifier,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      raw.id,
    );
  }
}
