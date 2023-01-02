import { injectable, inject } from 'tsyringe';

import IServiceRepository from '../../../repositories/IServiceRepository';
import Service from '../../typeorm/entities/Service';

interface IRequest {
  companyId: string;
  showDisabled: boolean;
}

@injectable()
class ListServicesByCompanyService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
  ) {}

  public async execute({
    companyId,
    showDisabled,
  }: IRequest): Promise<Service[]> {
    const services = await this.serviceRepository.findByCompanyId(
      companyId,
      Boolean(showDisabled),
    );

    return services;
  }
}

export default ListServicesByCompanyService;
