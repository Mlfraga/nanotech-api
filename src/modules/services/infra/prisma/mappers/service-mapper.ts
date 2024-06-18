import { Prisma } from '@prisma/client';
import { Service } from '../../entities/Service';
import { ServiceGroup } from '../../entities/ServiceGroup';

export type PrismaServiceProvider = Prisma.servicesGetPayload<{
  include: {
    companies: {
      include: {
        company_prices: true
      }
    };
    service_group: true;
  }
}>;

export class ServiceMapper {
  static toPrisma(data: Service) {
    return {
      name:  data.name,
      price: data.price,
      enabled: data.enabled,
      company_price: data.company_price,
      commission_amount: data.commission_amount,
      company_id: data.company_id,
      service_group_id: data.service_group_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  }

  static toDomain(raw: PrismaServiceProvider) {
    return new Service(
      {
        price: Number(raw.price),
        company_price: Number(raw.company_price),
        enabled: raw.enabled,
        name: raw.name,
        service_group_id: raw.service_group_id ?? undefined,
        ...(raw.service_group && {
          service_group: new ServiceGroup({
            name: raw.service_group.name,
            description: raw.service_group.description ?? undefined,
            image_url: raw.service_group.image_url ?? undefined,
            created_at: raw.service_group.created_at,
            enabled: raw.service_group.enabled,
            updated_at: raw.service_group.updated_at,
          }, raw.service_group.id),
        }),
        company_id: raw.company_id ?? undefined,
        created_at: raw.created_at,
      },
      raw.id,
    );
  }
}
