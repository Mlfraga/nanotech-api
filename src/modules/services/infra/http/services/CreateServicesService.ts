import { inject, injectable } from 'tsyringe';

import IServiceRepository from '../../../repositories/IServiceRepository';
import { Service } from '../../entities/Service';

interface IRequest {
  name: string;
  price: number;
  commission_amount?: number;
  company_id: string;
}

@injectable()
class CreateServiceService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    name,
    price,
    company_id,
    commission_amount,
  }: IRequest): Promise<Service> {
    const createdService = await this.serviceRepository.create({
      name,
      price,
      company_id,
      commission_amount,
    });

    return createdService;
  }
}

export default CreateServiceService;
