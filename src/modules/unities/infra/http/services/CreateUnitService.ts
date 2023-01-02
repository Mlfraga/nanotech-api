import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';

import IUnitRepository from '../../../repositories/IUnitRepository';

interface IShowUnitsByCompanyServiceParams {
  name: string;
  telephone: string;
  companyId: string;
  client_identifier: string;
}

@injectable()
class ShowUnitsByCompanyService {
  constructor(
    @inject('UnitRepository')
    private unitRepository: IUnitRepository,

    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,
  ) {}

  public async execute({
    name,
    telephone,
    companyId,
    client_identifier,
  }: IShowUnitsByCompanyServiceParams): Promise<void> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new AppError('Company was not found.');
    }

    const unitByName = await this.unitRepository.findByNameAndCompany(
      companyId,
      name,
    );

    if (unitByName && unitByName.length > 0) {
      throw new AppError('Already has a unit of this company with that name.');
    }

    await this.unitRepository.create({
      name,
      telephone,
      company_id: companyId,
      client_identifier: String(client_identifier).toUpperCase(),
    });
  }
}

export default ShowUnitsByCompanyService;
