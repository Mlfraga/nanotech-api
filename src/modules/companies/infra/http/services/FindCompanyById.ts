import { injectable, inject } from 'tsyringe';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import { Company } from '../../entities/Company';

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

  public async execute({ id }: IRequest): Promise<Company | string> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      return 'company not found';
    }

    return company;
  }
}

export default FindCompanyById;
