import { ServiceProvider } from '../../entities/ServiceProvider';

export class ServiceProviderViewModel {
  static toHttp(serviceProvider: ServiceProvider) {
    return {
      id: serviceProvider.id,
      sale_id: serviceProvider.sale_id,
      service_provider_profile_id: serviceProvider.service_provider_profile_id,
      date_to_be_done: serviceProvider.date_to_be_done,
      sale: serviceProvider.sale,
      provider: serviceProvider.provider,
    };
  }
}
