import { ServiceGroupCategory } from '../infra/entities/ServiceGroupCategory';

export default interface IServiceGroupCategoryRepository {
  find(): Promise<ServiceGroupCategory[]>;
  findById(id: string): Promise<ServiceGroupCategory | undefined>;
  create(data: ServiceGroupCategory): Promise<ServiceGroupCategory>;
  save(service: ServiceGroupCategory): Promise<ServiceGroupCategory>;
  delete(id: string): Promise<void>;
}
