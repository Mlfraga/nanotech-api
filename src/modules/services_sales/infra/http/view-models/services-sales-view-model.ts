import { ServiceSale } from '../../entities/ServiceSale';

export class ServiceSalesProviderViewModel {
  static toHttp(serviceSale: ServiceSale) {
    return {
      id: serviceSale.id,
      company_value: serviceSale.company_value,
      cost_value: serviceSale.cost_value,
      sale_id: serviceSale.sale_id,
      sale: serviceSale.sale,
      service_id: serviceSale.service_id,
      service: serviceSale.service,
      created_at: serviceSale.created_at,
      updated_at: serviceSale.updated_at,
    };
  }
}
