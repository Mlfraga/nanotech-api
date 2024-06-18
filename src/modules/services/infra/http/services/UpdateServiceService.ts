import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceRepository from '../../../repositories/IServiceRepository';
import { Service } from '../../entities/Service';

interface IRequest {
  id: string;
  name: string;
  price: number;
  commission_amount?: number;
  company_price: number;
}

@injectable()
class UpdateServiceService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    id,
    name,
    price,
    company_price,
    commission_amount,
  }: IRequest): Promise<Service> {
    const serviceById = await this.serviceRepository.findById(String(id));

    if (!serviceById) {
      throw new AppError('Service does not exists.', 404);
    }

    serviceById.name = name;
    serviceById.price = price;
    serviceById.company_price = company_price;
    serviceById.commission_amount = commission_amount;

    const updatedService = await this.serviceRepository.save(serviceById);

    return updatedService;
  }
}

export default UpdateServiceService;
