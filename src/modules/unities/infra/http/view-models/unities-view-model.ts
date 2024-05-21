import { Unit } from '../../entities/Unit';

export class UnitViewModel {
  static toHttp(serviceProvider: Unit) {
    return {
      id: serviceProvider.id,
      name: serviceProvider.name,
      telephone: serviceProvider.telephone,
      client_identifier: serviceProvider.client_identifier,
      company_id: serviceProvider.company_id,
      company: serviceProvider.company,
      profiles: serviceProvider.profiles,
      sales: serviceProvider.sales,
      created_at: serviceProvider.created_at,
      updated_at: serviceProvider.updated_at,
    };
  }
}
