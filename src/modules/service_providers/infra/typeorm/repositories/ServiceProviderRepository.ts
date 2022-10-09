import { getRepository, Repository } from 'typeorm';

import ICreateServiceProviderDTO from '../../../dtos/ICreateServiceProviderDTO';
import IServiceProviderRepository from '../../../repositories/IServiceProviderRepository';
import SaleServiceProvider from '../entities/SaleServiceProvider';

class ServiceProviderRepository implements IServiceProviderRepository {
  private ormRepository: Repository<SaleServiceProvider>;

  constructor() {
    this.ormRepository = getRepository(SaleServiceProvider);
  }

  public async find(): Promise<SaleServiceProvider[] | undefined> {
    const saleServiceProvider = await this.ormRepository.find({});

    return saleServiceProvider;
  }

  public async findById(id: string): Promise<SaleServiceProvider | undefined> {
    const saleServiceProvider = await this.ormRepository.findOne(id);

    return saleServiceProvider;
  }

  public async findByProviderId(
    provider_id: string,
  ): Promise<SaleServiceProvider[]> {
    const saleServiceProviders = await this.ormRepository.find({
      where: { service_provider_profile_id: provider_id },
      relations: [
        'sale',
        'sale.seller',
        'sale.car',
        'sale.unit',
        'sale.unit.company',
        'sale.services_sales',
      ],
    });

    return saleServiceProviders;
  }

  public async create(
    data: ICreateServiceProviderDTO,
  ): Promise<SaleServiceProvider> {
    const saleServiceProvider = this.ormRepository.create(data);

    await this.ormRepository.save(saleServiceProvider);

    return saleServiceProvider;
  }

  public async save(user: SaleServiceProvider): Promise<SaleServiceProvider> {
    return this.ormRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default ServiceProviderRepository;
