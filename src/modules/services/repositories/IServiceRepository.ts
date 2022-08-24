import ICreateServiceDTO from '../dtos/ICreateServiceDTO';
import Service from '../infra/typeorm/entities/Service';

export default interface IServiceRepository {
  find(): Promise<Service[] | undefined>;
  findById(id: string): Promise<Service | undefined>;
  findByCompanyId(
    companyId: string,
    showDisabled: boolean,
  ): Promise<Service[] | undefined>;
  findByName(name: string): Promise<Service | undefined>;
  create(data: ICreateServiceDTO): Promise<Service>;
  save(service: Service): Promise<Service>;
  delete(id: string): Promise<void>;
}
