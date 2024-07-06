import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name: string;
  description: string;
}

@injectable()
class UpdateServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const serviceGroup = await this.serviceGroupRepository.findById(id);
    console.log("🚀 ~ UpdateServiceGroupService ~ execute ~ serviceGroup:", serviceGroup)

    if (!serviceGroup) {
      throw new AppError('Service group not found.');
    }

    serviceGroup.name = serviceGroup.name;
    serviceGroup.description = serviceGroup.description;

    await this.serviceGroupRepository.save(serviceGroup);
  }
}

export default UpdateServiceGroupService;
