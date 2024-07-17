import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICompanyPricesRepository from '@modules/company_prices/repositories/ICompanyPricesRepository';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';

interface IRequest {
  companyId: string;
  services: {
    serviceId: string;
    price: number;
  }[];
}

@injectable()
class SetCompanyPricesService {
  constructor(
    @inject('CompanyPricesRepository')
    private companyPricesRepository: ICompanyPricesRepository,

    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({ companyId, services }: IRequest): Promise<void> {
    const companyById = this.companyPricesRepository.findById(companyId);

    if (!companyById) {
      throw new AppError('No company found with this ID.');
    }

    const companiesUpdated = [];

    for (const service of services) {
      const serviceById = await this.serviceRepository.findById(
        service.serviceId,
      );

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      serviceById.company_price = service.price;

      const serviceUpdated = await this.serviceRepository.save(serviceById);

      if (serviceUpdated) {
        companiesUpdated.push(serviceUpdated);
      }
    }
  }
}

export default SetCompanyPricesService;
