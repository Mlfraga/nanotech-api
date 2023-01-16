import { Company } from '@modules/companies/infra/entities/Company';
import ICreateCompanyPricesDTO from '@modules/company_prices/dtos/ICreateCompanyPricesDTO';
import { Service } from '@modules/services/infra/entities/Service';
import { Prisma } from '@prisma/client';
import { CompanyPrice } from '../../entities/CompanyPrice';

export type PrismaCompanyPrice = Prisma.company_pricesGetPayload<{
  include: {
    companies: true;
    services: true;
  };
}>;

export class PrismaCompanyPriceMapper {
  static toPrisma(company: ICreateCompanyPricesDTO) {
    return {
      price: company.price,
      company_id: company.company_id,
      service_id: company.service_id,
    };
  }

  static toDomain(raw: PrismaCompanyPrice) {
    return new CompanyPrice(
      {
        price: raw.price.toNumber(),
        company_id: raw.company_id,
        company: new Company({
          name: raw.companies.name,
          cnpj: raw.companies.cnpj,
          telephone: raw.companies.telephone,
          client_identifier: raw.companies.client_identifier,
          unities: [],
          created_at: raw.companies.created_at,
          updated_at: raw.companies.updated_at,
        }),
        service_id: raw.service_id,
        service: new Service({
          name: raw.services.name,
          price: raw.services.price.toNumber(),
          enabled: raw.services.enabled,
          created_at: raw.services.created_at,
          updated_at: raw.services.updated_at,
          company_price: raw.services.company_price?.toNumber() ?? 0,
          company_id: raw.services.company_id,
          company: null,
        }),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      raw.id,
    );
  }
}
