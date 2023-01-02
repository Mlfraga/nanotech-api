import { injectable, inject } from 'tsyringe';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import Company from '../../typeorm/entities/Company';

type IListCompaniesResponse = Company[];

@injectable()
class ListCompaniesService {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute(): Promise<IListCompaniesResponse> {
    const companies = await this.companyRepository.find();

    return companies;
  }
}

export default ListCompaniesService;
