import { ServiceGroupCategory } from '../../entities/ServiceGroupCategory';

export class ServiceGroupCategoriesViewModel {
  static toHttp(service: ServiceGroupCategory) {
    return {
      id: service.id,
      name: service.name,
      created_at: service.created_at,
      updated_at: service.updated_at,
    };
  }
}
