import { Prisma } from '@prisma/client';
import { ServiceGroup } from '../../entities/ServiceGroup';
import { Service } from '../../entities/Service';
import { Company } from '@modules/companies/infra/entities/Company';

export type PrismaServiceGroupProvider = Prisma.service_groupGetPayload<{
  include: {
    services: {
      include: {
        companies: true
      }
    }
  }
}>;

export class ServiceGroupMapper {
  static toPrisma(data: ServiceGroup) {
    return {
      name: data.name,
      description: data.description,
      image_url: data.image_url,
      enabled: data.enabled,
      default_nanotech_price: data.default_nanotech_price,
    }
  }

  static toDomain(raw: PrismaServiceGroupProvider) {
    return new ServiceGroup(
      {
        name: raw.name,
        description: raw.description || undefined,
        image_url: raw.image_url || undefined,
        created_at: raw.created_at,
        ...(raw.default_nanotech_price && {default_nanotech_price: Number(raw.default_nanotech_price)}),
        updated_at: raw.created_at,
        services: raw.services.map(service => new Service({
          name: service.name,
          enabled: service.enabled,
          price: Number(service.price),
          company_price: Number(service.company_price),
          ...(service.commission_amount && {commission_amount: Number(service.commission_amount)}),
          company_id: service.company_id || undefined,
          service_group_id: service.service_group_id || undefined,
          ...(service.companies && {
            company: new Company({
              client_identifier: service.companies.client_identifier,
              cnpj: service.companies.cnpj,
              name: service.companies.name,
              telephone: service.companies.telephone,
              unities: [],
              created_at: service.companies.created_at,
              updated_at: service.companies.updated_at,
            }, service.companies.id)
          }),
        }, service.id)),
        enabled: raw.enabled,
      },
      raw.id,
    );
  }
}
