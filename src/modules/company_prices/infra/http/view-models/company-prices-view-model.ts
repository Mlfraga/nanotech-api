import { CompanyPrice } from '../../../infra/entities/CompanyPrice';

export class CompanyPricesViewModel {
  static list(companyPrices: CompanyPrice[]) {
    return companyPrices.map(companyPrice => {
      return {
        price: companyPrice.price,
        company_id: companyPrice.company_id,
        company: companyPrice.company,
        service_id: companyPrice.service_id,
        service: companyPrice.service,
        created_at: companyPrice.created_at,
        updated_at: companyPrice.updated_at,
      };
    });
  }

  static toHttp(companyPrice: CompanyPrice) {
    return {
      price: companyPrice.price,
      company_id: companyPrice.company_id,
      company: companyPrice.company,
      service_id: companyPrice.service_id,
      service: companyPrice.service,
      created_at: companyPrice.created_at,
      updated_at: companyPrice.updated_at,
    };
  }
}
