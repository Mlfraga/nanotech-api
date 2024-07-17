import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICommissionerRepository from '@modules/_legacy_commissioners/repositories/ICommissionerRepository';

import Commissioner from '../../typeorm/entities/Commissioner';

type IUpdateCommissionerServiceResponse = Commissioner;

interface IUpdateCommissionerServiceParams {
  id: string;
  telephone: string;
  name: string;
  enabled: boolean;
  pix_key_type: 'CPF' | 'PHONE' | 'EMAIL' | 'RANDOM';
  pix_key: string;
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
    pix_key_type,
    pix_key,
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
      pix_key_type: pix_key_type,
      pix_key,
    });

    return updatedCommissioner;
  }
}

export default UpdateCommissionerService;
