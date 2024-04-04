import { inject, injectable } from 'tsyringe';

import ICommissionerRepository from '@modules/commissioners/repositories/ICommissionerRepository';

import Commissioner from '../../typeorm/entities/Commissioner';

type ICreateCommissionerServiceResponse = Commissioner;

interface ICreateCommissionerServiceParams {
  name: string;
  telephone: string;
  company_id: string;
  pix_key_type: 'CPF' | 'PHONE' | 'EMAIL' | 'RANDOM';
  pix_key: string;
}

@injectable()
class CreateCommissionerService {
  constructor(
    @inject('CommissionerRepository')
    private commissionerRepository: ICommissionerRepository,
  ) {}

  public async execute({
    name,
    telephone,
    company_id,
    pix_key_type,
    pix_key,
  }: ICreateCommissionerServiceParams): Promise<ICreateCommissionerServiceResponse> {
    const commissioner = await this.commissionerRepository.create({
      name,
      telephone,
      company_id,
      pix_key_type,
      pix_key,
    });

    return commissioner;
  }
}

export default CreateCommissionerService;
