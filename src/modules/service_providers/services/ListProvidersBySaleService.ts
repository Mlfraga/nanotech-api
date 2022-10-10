import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import SalesServiceProviders from '../infra/typeorm/entities/SaleServiceProvider';
import IServiceProviderRepository from '../repositories/IServiceProviderRepository';

@injectable()
class ListProvidersBySaleService {
  constructor(
    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,
  ) {}

  public async execute(
    sale_id: string,
  ): Promise<SalesServiceProviders[] | undefined> {
    const serviceSalesProviders =
      await this.serviceProviderRepository.findBySale(sale_id);

    return classToClass(serviceSalesProviders);
  }
}

export default ListProvidersBySaleService;
