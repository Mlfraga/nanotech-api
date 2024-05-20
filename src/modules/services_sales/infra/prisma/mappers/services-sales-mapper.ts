import { Prisma } from '@prisma/client';
import ICreateServiceDTO from '@modules/services/dtos/ICreateServiceDTO';
import { ServiceSale } from '../../entities/ServiceSale';
import { Service } from '@modules/services/infra/entities/Service';
import { ServiceGroup } from '@modules/services/infra/entities/ServiceGroup';
import ICreateServiceSaleDTO from '@modules/services_sales/dtos/ICreateServiceSaleDTO';

export type PrismaServiceSalesProvider = Prisma.services_salesGetPayload<{
  include: {
    service: {
      include: {
        service_group: true,
      },
    },
  }
}>;

export class ServiceSalesMapper {
  static toPrisma(data: ICreateServiceSaleDTO) {
    return {
      company_value: data.company_value,
      cost_value: data.cost_value,
      sale_id: data.sale_id,
      commissioner_id: data.commissioner_id,
      service_id: data.service_id,
    };
  }

  static toDomain(raw: PrismaServiceSalesProvider) {
    return new ServiceSale(
      {
        company_value: Number(raw.company_value),
        service_id: raw.service_id,
        cost_value: Number(raw.cost_value),
        sale_id: raw.sale_id,
        service: new Service({
          company_price: Number(raw.service.company_price),
          company_id: raw.service.company_id || undefined,
          created_at: raw.service.created_at,
          enabled: raw.service.enabled,
          name: raw.service.name,
          price: Number(raw.service.price),
          company: undefined,
          service_group_id: raw.service.service_group_id || undefined,
          ...(raw.service.service_group && ({
            service_group: new ServiceGroup({
              created_at: raw.service.service_group.created_at,
              name: raw.service.service_group.name,
              updated_at: raw.service.service_group.updated_at,
              decription: raw.service.service_group.decription,
              image_url: raw.service.service_group.image_url,
            }, raw.service.service_group.id)
          })),
        }, raw.service.id),
      }, raw.id
    );
  }
}
