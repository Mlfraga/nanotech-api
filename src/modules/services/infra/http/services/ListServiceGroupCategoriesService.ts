import { inject, injectable } from 'tsyringe';

import IServiceGroupCategoryRepository from '@modules/services/repositories/IServiceGroupCategoryRepository';
import { ServiceGroupCategory } from '../../entities/ServiceGroupCategory';


@injectable()
class ListServiceGroupCategoriesService {
  constructor(
    @inject('ServiceGroupCategoryRepository')
    private serviceGroupCategoryRepository: IServiceGroupCategoryRepository,
  ) {}

  public async execute(): Promise<ServiceGroupCategory[]> {
    const serviceGroupsCategories = await this.serviceGroupCategoryRepository.find();

    return serviceGroupsCategories;
  }
}

export default ListServiceGroupCategoriesService;
