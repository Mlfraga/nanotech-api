import { ServiceGroup } from '../../entities/ServiceGroup';

export class ServiceGroupViewModel {
  static toHttp(service: ServiceGroup) {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      image_url: service.image_url,
    };
  }
}
