import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';
import { companies as RawCompany } from '@prisma/client';
import { Company } from '../../entities/Company';

export class PrismaCompanyMapper {
  static toPrisma(company: ICreateCompanyDTO) {
    return {
      name: company.name,
      cnpj: company.cnpj,
      telephone: company.telephone,
      client_identifier: company.client_identifier,
    };
  }

  static toDomain(raw: RawCompany) {
    return new Company(
      {
        name: raw.name,
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
