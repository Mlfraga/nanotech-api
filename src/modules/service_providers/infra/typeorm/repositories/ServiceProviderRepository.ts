import { addDays, startOfDay, endOfDay } from 'date-fns';
import { Between, getRepository, Repository } from 'typeorm';

import ICreateServiceProviderDTO from '../../../dtos/ICreateServiceProviderDTO';
import IServiceProviderRepository from '../../../repositories/IServiceProviderRepository';
import SaleServiceProvider from '../entities/SaleServiceProvider';

class ServiceProviderRepository implements IServiceProviderRepository {
  private ormRepository: Repository<SaleServiceProvider>;

  constructor() {
    this.ormRepository = getRepository(SaleServiceProvider);
  }

  public async find(): Promise<SaleServiceProvider[] | undefined> {
    const saleServiceProvider = await this.ormRepository.find({
      relations: ['provider'],
    });

    return saleServiceProvider;
  }

  public async findBySale(sale_id: string): Promise<SaleServiceProvider[]> {
    const saleServiceProviders = await this.ormRepository.find({
      where: {
        sale_id,
      },
      relations: ['provider', 'sale'],
    });

    return saleServiceProviders;
  }

  public async findById(id: string): Promise<SaleServiceProvider | undefined> {
    const saleServiceProvider = await this.ormRepository.findOne(id);

    return saleServiceProvider;
  }

  public async findByProviderAndSaleId(
    provider_id: string,
    sale_id: string,
  ): Promise<SaleServiceProvider | undefined> {
    const saleServiceProvider = await this.ormRepository.findOne({
      where: {
        service_provider_profile_id: provider_id,
        sale_id,
      },
    });

    return saleServiceProvider;
  }

  public async findByProviderId(
    provider_id: string,
    listFrom?: 'yesterday' | 'today' | 'tomorrow',
  ): Promise<SaleServiceProvider[]> {
    let dateFilterCriteria = Between(
      new Date(startOfDay(new Date())),
      new Date(endOfDay(new Date())),
    );

    if (listFrom === 'yesterday') {
      dateFilterCriteria = Between(
        addDays(startOfDay(new Date()), -1),
        addDays(endOfDay(new Date()), -1),
      );
    }

    if (listFrom === 'tomorrow') {
      dateFilterCriteria = Between(
        addDays(startOfDay(new Date()), 1),
        addDays(endOfDay(new Date()), 1),
      );
    }

    const saleServiceProviders = await this.ormRepository.find({
      where: {
        service_provider_profile_id: provider_id,
        date_to_be_done: dateFilterCriteria,
      },
      relations: [
        'sale',
        'sale.seller',
        'sale.car',
        'sale.unit',
        'sale.unit.company',
        'sale.services_sales',
      ],
    });

    return saleServiceProviders.sort((a, b) =>
      a.sale.delivery_date > b.sale.delivery_date ? 1 : -1,
    );
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

  public async deleteBySale(sale_id: string): Promise<void> {
    this.ormRepository.delete({ sale_id });
  }
}

export default ServiceProviderRepository;
