import { inject, injectable } from 'tsyringe';

import IServiceGroupCategoryRepository from '@modules/services/repositories/IServiceGroupCategoryRepository';
import { ServiceGroupCategory } from '../../entities/ServiceGroupCategory';

interface IRequest {
  name: string;
}

@injectable()
class CreateServiceGroupCategoryService {
  constructor(
    @inject('ServiceGroupCategoryRepository')
    private serviceGroupCategoryRepository: IServiceGroupCategoryRepository,
  ) {}

  public async execute({
    name,
  }: IRequest): Promise<ServiceGroupCategory> {
    const createdServiceGroupCategory = await this.serviceGroupCategoryRepository.create(new ServiceGroupCategory({
      name,
    }));

    return createdServiceGroupCategory;
  }
}

export default CreateServiceGroupCategoryService;
