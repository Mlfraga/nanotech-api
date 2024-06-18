import { inject, injectable } from 'tsyringe';

import IServiceRepository from '../../../repositories/IServiceRepository';
import { Service } from '../../entities/Service';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  price: number;
  commission_amount?: number;
  company_id: string;
  service_group_id: string;
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
    service_group_id
  }: IRequest): Promise<Service> {
    const serviceAlreadyExists = await this.serviceRepository.findByCompanyIdAndServiceGroup(company_id, service_group_id);

    if (serviceAlreadyExists) {
      throw new AppError('This service already exists in this company and service group.');
    }

    const createdService = await this.serviceRepository.create({
      name,
      price,
      company_id,
      commission_amount,
      service_group_id
    });

    return createdService;
  }
}

export default CreateServiceService;
