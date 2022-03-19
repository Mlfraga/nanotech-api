import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import ServiceRepository from '../../../../services/infra/typeorm/repositories/ServiceRepository';
import CompanyPricesRepository from '../../typeorm/repositories/CompanyPricesRepository';

export default class CompanyPricesByCompanyController {
  async index(request: Request, response: Response) {
    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const userRepository = container.resolve(UserRepository);

    const { id } = request.user;

    const user = await userRepository.findById(id);

    if (!user?.profile.company_id) {
      throw new AppError('This user is not linked to a company.');
    }

    const companyServicesByCompany =
      await companyPricesRepository.findByCompanyId(
        String(user?.profile.company_id),
      );

    if (!companyServicesByCompany) {
      throw new AppError('No service from this company was found.');
    }

    return response.json(companyServicesByCompany);
  }

  async show(request: Request, response: Response) {
    const { id: company_id } = request.params;
    const serviceRepository = container.resolve(ServiceRepository);

    const companyServicesByCompany = await serviceRepository.findByCompanyId(
      String(company_id),
    );

    if (!companyServicesByCompany) {
      throw new AppError('No service from this company was found.');
    }

    return response.json(companyServicesByCompany);
  }
}
