import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CpfCnpjUtils from '@shared/utils/CpfCnpjUtils';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import Company from '../../typeorm/entities/Company';

type ICreateCompanyServiceResponse = Company;

interface ICreateCompanyServiceParams {
  name: string;
  telephone: string;
  cnpj: string;
  client_identifier: string;
}

@injectable()
class CreateCompanyService {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute({
    name,
    telephone,
    cnpj,
    client_identifier,
  }: ICreateCompanyServiceParams): Promise<ICreateCompanyServiceResponse> {
    const isCnpjValid = CpfCnpjUtils.isCnpjValid(cnpj);

    if (!isCnpjValid) {
      throw new AppError('Invalid CNPJ.', 409);
    }

    const companyByName = await this.companyRepository.findByName(name);

    if (companyByName) {
      throw new AppError('Already has a company with this name.', 409);
    }

    const companyByCnpj = await this.companyRepository.findByCnpj(cnpj);

    if (companyByCnpj) {
      throw new AppError('Already has a company with this CNPJ.', 409);
    }

    const company = await this.companyRepository.create({
      name,
      telephone,
      cnpj,
      client_identifier: String(client_identifier).toUpperCase(),
    });

    return company;
  }
}

export default CreateCompanyService;
