import { Prisma } from '@prisma/client';
import { Service } from '../../entities/Service';
import ICreateServiceDTO from '@modules/services/dtos/ICreateServiceDTO';

export type PrismaServiceProvider = Prisma.servicesGetPayload<{
  include: {
    companies: {
      include: {
        company_prices: true
      }
    };
  }
}>;

export class ServiceMapper {
  static toPrisma(data: ICreateServiceDTO) {
    return {
      name:  data.name,
      price:  data.price,
      commission_amount: data.commission_amount,
      company_id: data.company_id,
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
        company_id: raw.company_id ?? undefined,
        created_at: raw.created_at,
      },
      raw.id,
    );
  }
}
