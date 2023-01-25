import { inject, injectable } from 'tsyringe';

import ICommissionerRepository from '@modules/commissioners/repositories/ICommissionerRepository';

import Commissioner from '../../typeorm/entities/Commissioner';

type ICreateCommissionerServiceResponse = Commissioner;

interface ICreateCommissionerServiceParams {
  name: string;
  telephone: string;
  company_id: string;
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
  }: ICreateCommissionerServiceParams): Promise<ICreateCommissionerServiceResponse> {
    const commissioner = await this.commissionerRepository.create({
      name,
      telephone,
      company_id,
    });

    return commissioner;
  }
}

export default CreateCommissionerService;
