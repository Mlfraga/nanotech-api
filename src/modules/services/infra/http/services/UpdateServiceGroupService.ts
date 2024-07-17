import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import AppError from '@shared/errors/AppError';
import IServiceGroupCategoryRepository from '@modules/services/repositories/IServiceGroupCategoryRepository';

interface IRequest {
  id: string;
  name: string;
  category_id: string;
  description: string;
}

@injectable()
class UpdateServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,

    @inject('ServiceGroupCategoryRepository')
    private serviceGroupCategoryRepository: IServiceGroupCategoryRepository,
  ) {}

  public async execute({ id, name, description, category_id }: IRequest): Promise<void> {
    const serviceGroup = await this.serviceGroupRepository.findById(id);

    if (!serviceGroup) {
      throw new AppError('Service group not found.');
    }

    const serviceGroupCategoryExists = await this.serviceGroupCategoryRepository.findById(category_id);

    if (serviceGroupCategoryExists) {
      serviceGroup.category_id = category_id;
    }

    serviceGroup.name = name;
    serviceGroup.description = description;

    await this.serviceGroupRepository.save(serviceGroup);
  }
}

export default UpdateServiceGroupService;
