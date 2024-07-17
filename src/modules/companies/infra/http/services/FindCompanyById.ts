import { injectable, inject } from 'tsyringe';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import { Company } from '../../entities/Company';
import AppError from '@shared/errors/AppError';

type IListCompaniesResponse = Company;

interface IRequest {
  id: string;
}

@injectable()
class FindCompanyById {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<IListCompaniesResponse> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new AppError('Company not found');
    }

    return company;
  }
}

export default FindCompanyById;
