import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';

interface IRequest {}

@injectable()
class ListServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,
  ) {}

  public async execute({}: IRequest): Promise<ServiceGroup[]> {
    const serviceGroups = await this.serviceGroupRepository.find();

    return serviceGroups;
  }
}

export default ListServiceGroupService;
