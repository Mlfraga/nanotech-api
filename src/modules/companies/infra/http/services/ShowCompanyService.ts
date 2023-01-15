import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import {Company} from '../../entities/Company';

type ListCompaniesResponse = Company;

interface IRequest {
  id: string;
}

@injectable()
class ShowCompanyService {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<ListCompaniesResponse> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new AppError('This sale was not found', 404);
    }

    return company;
  }
}

export default ShowCompanyService;
