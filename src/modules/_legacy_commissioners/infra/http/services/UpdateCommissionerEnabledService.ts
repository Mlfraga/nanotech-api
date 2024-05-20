import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICommissionerRepository from '@modules/_legacy_commissioners/repositories/ICommissionerRepository';

import Commissioner from '../../typeorm/entities/Commissioner';

type IUpdateCommissionerEnabledServiceResponse = Commissioner;

interface IUpdateCommissionerEnabledServiceParams {
  id: string;
  enabled: boolean;
}

@injectable()
class UpdateCommissionerEnabledService {
  constructor(
    @inject('CommissionerRepository')
    private commissionerRepository: ICommissionerRepository,
  ) {}

  public async execute({
    id,
    enabled,
  }: IUpdateCommissionerEnabledServiceParams): Promise<IUpdateCommissionerEnabledServiceResponse> {
    const commissioner = await this.commissionerRepository.findById(id);

    if (!commissioner) {
      throw new AppError('Commissioner not found');
    }

    const updatedCommissioner = await this.commissionerRepository.save({
      ...commissioner,
      enabled,
    });

    return updatedCommissioner;
  }
}

export default UpdateCommissionerEnabledService;
