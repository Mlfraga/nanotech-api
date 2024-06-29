import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';

interface IRequest {
  name: string;
  defaultNanotechPrice?: number;
  description?: string;
  imageUrl?: string;
}

@injectable()
class CreateServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,
  ) {}

  public async execute({
    name,
    description,
    defaultNanotechPrice,
    imageUrl,
  }: IRequest): Promise<ServiceGroup> {
    const createdServiceGroup = await this.serviceGroupRepository.create(new ServiceGroup({
      name,
      description,
      image_url: imageUrl,
      enabled: true,
      default_nanotech_price: defaultNanotechPrice
    }));

    return createdServiceGroup;
  }
}

export default CreateServiceGroupService;
