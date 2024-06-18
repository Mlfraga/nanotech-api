import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';

interface IRequest {
  name: string;
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
    imageUrl,
  }: IRequest): Promise<ServiceGroup> {
    const createdServiceGroup = await this.serviceGroupRepository.create({
      name,
      description,
      imageUrl,
    });

    return createdServiceGroup;
  }
}

export default CreateServiceGroupService;
