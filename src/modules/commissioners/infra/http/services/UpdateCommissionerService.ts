import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICommissionerRepository from '@modules/commissioners/repositories/ICommissionerRepository';

import Commissioner from '../../typeorm/entities/Commissioner';

type IUpdateCommissionerServiceResponse = Commissioner;

interface IUpdateCommissionerServiceParams {
  id: string;
  telephone: string;
  name: string;
  enabled: boolean;
}

@injectable()
class UpdateCommissionerService {
  constructor(
    @inject('CommissionerRepository')
    private commissionerRepository: ICommissionerRepository,
  ) {}

  public async execute({
    id,
    telephone,
    name,
    enabled,
  }: IUpdateCommissionerServiceParams): Promise<IUpdateCommissionerServiceResponse> {
    const commissioner = await this.commissionerRepository.findById(id);

    if (!commissioner) {
      throw new AppError('Commissioner not found');
    }

    const updatedCommissioner = await this.commissionerRepository.save({
      ...commissioner,
      telephone,
      name,
      enabled,
    });

    return updatedCommissioner;
  }
}

export default UpdateCommissionerService;
