import { Sale } from '../../entities/Sale';

export class SaleViewModel {
  static toHttp(sale: Sale) {
    return {
      id: sale.id,
      client_identifier: sale.client_identifier,
      request_date: sale.request_date,
      availability_date: sale.availability_date,
      delivery_date: sale.delivery_date,
      status: sale.status,
      production_status: sale.production_status,
      company_value: sale.company_value,
      cost_value: sale.cost_value,
      source: sale.source,
      comments: sale.comments,
      partner_external_id: sale.partner_external_id,
      techinical_comments: sale.techinical_comments,
      seller_id: sale.seller_id,
      seller: sale.seller,
      unit_id: sale.unit_id,
      unit: sale.unit,
      person_id: sale.person_id,
      person: sale.person,
      car_id: sale.car_id,
      car: sale.car,
      services_sales: sale.services_sales,
      service_providers: sale.service_providers,
      updated_at: sale.updated_at,
      created_at: sale.created_at,
      finished_at: sale.finished_at,
    };
  }
}
