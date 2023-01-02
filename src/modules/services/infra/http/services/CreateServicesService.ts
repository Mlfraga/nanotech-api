import { injectable, inject } from 'tsyringe';

import IServiceRepository from '../../../repositories/IServiceRepository';
import Service from '../../typeorm/entities/Service';

interface IRequest {
  name: string;
  price: number;
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
  }: IRequest): Promise<Service> {
    const createdService = await this.serviceRepository.create({
      name,
      price,
      company_id,
    });

    return createdService;
  }
}

export default CreateServiceService;
