import { inject, injectable } from 'tsyringe';

import IServiceRepository from '../../../repositories/IServiceRepository';
import { Service } from '../../entities/Service';
import AppError from '@shared/errors/AppError';
import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';

interface IRequest {
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

    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,
  ) {}

  public async execute({
    price,
    company_id,
    commission_amount,
    service_group_id
  }: IRequest): Promise<Service> {
    const serviceGroup = await this.serviceGroupRepository.findById(service_group_id);

    if (!serviceGroup) {
      throw new AppError('Service group not found.');
    }

    const serviceAlreadyExists = await this.serviceRepository.findByCompanyIdAndServiceGroup(company_id, service_group_id);

    if (serviceAlreadyExists) {
      throw new AppError('This service already exists in this company and service group.');
    }

    const createdService = await this.serviceRepository.create({
      name: serviceGroup.name,
      company_id,
      service_group_id,
      price,
      commission_amount,
    });

    return createdService;
  }
}

export default CreateServiceService;
