import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CpfCnpjUtils from '@shared/utils/CpfCnpjUtils';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import Company from '../../typeorm/entities/Company';

type IUpdateCompanyServiceResponse = Company;

interface IUpdateCompanyServiceParams {
  id: string;
  name: string;
  telephone: string;
  cnpj: string;
  client_identifier: string;
}

@injectable()
class UpdateCompanyService {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute({
    id,
    name,
    telephone,
    cnpj,
    client_identifier,
  }: IUpdateCompanyServiceParams): Promise<IUpdateCompanyServiceResponse> {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new AppError('Does not exist a company with this id.');
    }

    const isCnpjValid = CpfCnpjUtils.isCnpjValid(cnpj);

    if (!isCnpjValid) {
      throw new AppError('Invalid CNPJ.', 409);
    }

    const companyByName = await this.companyRepository.findByName(name);

    if (companyByName && companyByName.id !== id) {
      throw new AppError('Already has a company with this name.', 409);
    }
    const companyByCnpj = await this.companyRepository.findByCnpj(cnpj);

    if (companyByCnpj && companyByCnpj.id !== id) {
      throw new AppError('Already has a company with this CNPJ.', 409);
    }

    const updatedCompany = await this.companyRepository.save({
      ...company,
      client_identifier,
      name,
      telephone,
      cnpj,
    });

    return updatedCompany;
  }
}

export default UpdateCompanyService;
