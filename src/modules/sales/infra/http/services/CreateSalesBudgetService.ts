import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceRepository from '@modules/services/repositories/IServiceRepository';

interface ICreateSalesBudgetServiceParams {
  services: string[];
}

@injectable()
class CreateSalesBudgetService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    services,
  }: ICreateSalesBudgetServiceParams): Promise<number> {
    let costPrice = 0;

    services.forEach(async (id: string): Promise<void> => {
      const serviceById = await this.serviceRepository.findById(id);

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      costPrice = Number(serviceById.price) + Number(costPrice);
    });

    return costPrice;
  }
}

export default CreateSalesBudgetService;
