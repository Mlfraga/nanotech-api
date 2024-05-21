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
      service_group: service.service_group,
      company: service.company,
      created_at: service.created_at,
      updated_at: service.updated_at,
    };
  }
}
