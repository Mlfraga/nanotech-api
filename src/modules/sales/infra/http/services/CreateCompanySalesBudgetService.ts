import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceRepository from '@modules/services/repositories/IServiceRepository';

interface ICreateCompanySalesBudgetServiceParams {
  services: string[];
}

@injectable()
class CreateCompanySalesBudgetService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    services,
  }: ICreateCompanySalesBudgetServiceParams): Promise<number> {
    let companyPrice = 0;

    for (const serviceId of services) {
      const serviceById = await this.serviceRepository.findById(
        String(serviceId),
      );

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      companyPrice = Number(serviceById.company_price) + Number(companyPrice);
    }

    return companyPrice;
  }
}

export default CreateCompanySalesBudgetService;
