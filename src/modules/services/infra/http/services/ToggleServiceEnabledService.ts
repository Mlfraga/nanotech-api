import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceRepository from '../../../repositories/IServiceRepository';

interface IRequest {
  id: string;
  enabled: boolean;
}

@injectable()
class ToggleServiceEnabledService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({ id, enabled }: IRequest): Promise<boolean> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new AppError('This service was not found.', 404);
    }

    const isServiceUpdated = this.serviceRepository.save({
      ...service,
      enabled,
    });

    return !!isServiceUpdated;
  }
}

export default ToggleServiceEnabledService;
