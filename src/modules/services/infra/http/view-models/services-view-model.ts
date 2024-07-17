import { Service } from '../../entities/Service';

export class ServicesViewModel {
  static toHttp(service: Service) {
    return {
      id: service.id,
      name: service.name,
      price: service.price,
      enabled: service.enabled,
      company_price: service.company_price,
      commission_amount: service.commission_amount,
      company_id: service.company_id,
      service_group_id: service.service_group_id,
      ...(service.service_group && {service_group: {
        id: service.service_group.id,
        name: service.service_group.name,
        description: service.service_group.description,
        enabled: service.service_group.enabled,
        image_url: service.service_group.image_url,
        created_at: service.service_group.created_at,
        updated_at: service.service_group.updated_at
      }}),
      company: service.company,
      created_at: service.created_at,
      updated_at: service.updated_at,
    };
  }
}
