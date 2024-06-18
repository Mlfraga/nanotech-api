import ICreateServiceGroupDTO from '../dtos/ICreateServiceGroupDTO';
import { ServiceGroup } from '../infra/entities/ServiceGroup';

export default interface IServiceGroupRepository {
  find(): Promise<ServiceGroup[]>;
  findById(id: string): Promise<ServiceGroup | undefined>;
  create(data: ICreateServiceGroupDTO): Promise<ServiceGroup>;
  save(service: ServiceGroup): Promise<ServiceGroup>;
  delete(id: string): Promise<void>;
}
