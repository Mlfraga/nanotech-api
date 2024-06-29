import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';

interface IRequest {
  enabled?: boolean;
}

@injectable()
class ListServiceGroupService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,
  ) {}

  public async execute({ enabled }: IRequest): Promise<ServiceGroup[]> {
    const serviceGroups = await this.serviceGroupRepository.find({
      enabled
    });

    return serviceGroups;
  }
}

export default ListServiceGroupService;
