import { inject, injectable } from 'tsyringe';

import IServiceGroupRepository from '@modules/services/repositories/IServiceGroupRepository';
import { ServiceGroup } from '../../entities/ServiceGroup';
import AppError from '@shared/errors/AppError';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';

interface IRequest {
  id: string;
}

@injectable()
class ToggleServiceGroupStatusService {
  constructor(
    @inject('ServiceGroupRepository')
    private serviceGroupRepository: IServiceGroupRepository,

    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository
  ) {}

  public async execute({ id }: IRequest): Promise<void> {
    const serviceGroup = await this.serviceGroupRepository.findById(id);

    if (!serviceGroup) {
      throw new AppError('Service group not found.');
    }

    serviceGroup.enabled = !serviceGroup.enabled;

    await this.serviceGroupRepository.save(serviceGroup);

    if(!serviceGroup.enabled && serviceGroup.services && serviceGroup.services.some(service => service.enabled)) {
      for(const service of serviceGroup.services) {
        service.enabled = false;

        await this.serviceRepository.save(service);
      }
    }
  }
}

export default ToggleServiceGroupStatusService;
