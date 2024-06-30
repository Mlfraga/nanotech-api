import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';

interface IRequest {
  name: string;
  defaultNanotechPrice?: number;
  description?: string;
  imageUrl?: string;
  companiesToLink: {
    id: string;
    price: number;
    commission: number;
  }[];
}

@injectable()
class CreateServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,

    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    name,
    description,
    defaultNanotechPrice,
    imageUrl,
    companiesToLink,
  }: IRequest): Promise<ServiceGroup> {
    const createdServiceGroup = await this.serviceGroupRepository.create(new ServiceGroup({
      name,
      description,
      image_url: imageUrl,
      enabled: true,
      default_nanotech_price: defaultNanotechPrice
    }));

    for (let company of companiesToLink) {
      await this.serviceRepository.create({
        service_group_id: createdServiceGroup.id,
        name,
        price: company.price,
        commission_amount: company.commission,
        company_id: company.id,
      });
    }

    return createdServiceGroup;
  }
}

export default CreateServiceGroupService;
