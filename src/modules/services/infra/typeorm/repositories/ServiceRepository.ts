import { getRepository, Repository } from 'typeorm';

import ICreateServiceDTO from '../../../dtos/ICreateServiceDTO';
import IServiceRepository from '../../../repositories/IServiceRepository';
import Service from '../entities/Service';

class ServiceRepository implements IServiceRepository {
  private ormRepository: Repository<Service>;

  constructor() {
    this.ormRepository = getRepository(Service);
  }

  public async find(): Promise<Service[] | undefined> {
    const service = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });

    return service;
  }

  public async findById(id: string): Promise<Service | undefined> {
    const service = await this.ormRepository.findOne(id);

    return service;
  }

  public async findByCompanyId(
    companyId: string,
    showDisabled: boolean,
  ): Promise<Service[]> {
    const services = await this.ormRepository.find({
      where: { company_id: companyId, ...(!showDisabled && { enabled: true }) },
      relations: ['company', 'company.company_prices'],
      order: {
        name: 'ASC',
      },
    });

    return services;
  }

  public async findByName(name: string): Promise<Service | undefined> {
    const service = await this.ormRepository.findOne({ where: { name } });

    return service;
  }

  public async create(data: ICreateServiceDTO): Promise<Service> {
    const service = this.ormRepository.create(data);

    await this.ormRepository.save(service);

    return service;
  }

  public async save(service: Service): Promise<Service> {
    return this.ormRepository.save(service);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default ServiceRepository;
