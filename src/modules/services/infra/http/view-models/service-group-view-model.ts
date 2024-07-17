import { ServiceGroup } from '../../entities/ServiceGroup';

export class ServiceGroupViewModel {
  static toHttp(service: ServiceGroup) {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      enabled: service.enabled,
      category_id: service.category_id,
      ...(service.category && {
        category: {
          id: service.category.id,
          name: service.category.name,
      } }),
      image_url: service.image_url,
      default_nanotech_price: service.default_nanotech_price,
      companies: service.services?.filter(service => !!service.company).map(service => ({
        name: service?.company?.name ?? '',
        id: service?.company?.id ?? '',
        cnpj: service?.company?.cnpj ?? '',
      }))
    };
  }
}
