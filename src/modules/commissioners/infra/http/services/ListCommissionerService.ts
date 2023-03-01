import { inject, injectable } from 'tsyringe';

import ICommissionerRepository from '@modules/commissioners/repositories/ICommissionerRepository';

import Commissioner from '../../typeorm/entities/Commissioner';

type IListCommissionerServiceResponse = Commissioner[];

interface IListCommissionerServiceParams {
  company_id: string;
}

@injectable()
class ListCommissionerService {
  constructor(
    @inject('CommissionerRepository')
    private commissionerRepository: ICommissionerRepository,
  ) {}

  public async execute({
    company_id,
  }: IListCommissionerServiceParams): Promise<IListCommissionerServiceResponse> {
    const commissioners = await this.commissionerRepository.findByCompany(
      company_id,
    );

    return commissioners;
  }
}

export default ListCommissionerService;
