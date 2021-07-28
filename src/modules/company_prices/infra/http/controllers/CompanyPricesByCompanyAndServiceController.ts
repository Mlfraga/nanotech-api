import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import CompanyPricesRepository from '../../typeorm/repositories/CompanyPricesRepository';

export default class CompanyPricesByCompanyAndServiceController {
  async index(request: Request, response: Response) {
    const { serviceId, company_id } = request.query;
    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const userRepository = container.resolve(UserRepository);

    let companyServiceByCompanyIdAndServiceId;

    if (!company_id) {
      const { id } = request.user;

      const user = await userRepository.findById(id);

      if (!user) {
        throw new AppError('User not found.', 404);
      }
      const userCompanyId = user.profile.company_id;

      companyServiceByCompanyIdAndServiceId =
        await companyPricesRepository.findByCompanyIdAndServiceId(
          String(userCompanyId),
          String(serviceId),
        );

      if (!companyServiceByCompanyIdAndServiceId) {
        throw new AppError('No service from this company was found.');
      }

      return response.json(companyServiceByCompanyIdAndServiceId);
    }

    companyServiceByCompanyIdAndServiceId =
      await companyPricesRepository.findByCompanyIdAndServiceId(
        String(company_id),
        String(serviceId),
      );

    if (!companyServiceByCompanyIdAndServiceId) {
      throw new AppError('No service from this company was found.');
    }

    return response.json(companyServiceByCompanyIdAndServiceId);
  }
}
