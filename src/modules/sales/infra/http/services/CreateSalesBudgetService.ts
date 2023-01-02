import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Service from '@modules/services/infra/typeorm/entities/Service';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';

interface ICreateSalesBudgetServiceParams {
  service_ids: string[];
}

@injectable()
class CreateSalesBudgetService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    service_ids,
  }: ICreateSalesBudgetServiceParams): Promise<number> {
    const services: Service[] = [];

    for (const service_id of service_ids) {
      const serviceById = await this.serviceRepository.findById(service_id);

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      services.push(serviceById);
    }

    const costPrice = services.reduce(
      (acc, service) => Number(acc) + Number(service.price),
      0,
    );

    return costPrice;
  }
}

export default CreateSalesBudgetService;
