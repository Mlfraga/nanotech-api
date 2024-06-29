import ICreateServiceGroupDTO from '../dtos/ICreateServiceGroupDTO';
import { ServiceGroup } from '../infra/entities/ServiceGroup';

export interface IFindFilters {
  enabled?: boolean;
}

export default interface IServiceGroupRepository {
  find(filters: IFindFilters): Promise<ServiceGroup[]>;
  findById(id: string): Promise<ServiceGroup | undefined>;
  create(data: ServiceGroup): Promise<ServiceGroup>;
  save(service: ServiceGroup): Promise<ServiceGroup>;
  delete(id: string): Promise<void>;
}
