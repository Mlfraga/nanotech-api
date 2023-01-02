import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '../../../../services/infra/typeorm/repositories/ServiceRepository';
import CompanyPricesRepository from '../../typeorm/repositories/CompanyPricesRepository';

export default class CompanyPricesController {
  async store(request: Request, response: Response) {
    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const serviceRepository = container.resolve(ServiceRepository);

    const { companyId, services } = request.body;

    const companyById = companyPricesRepository.findById(companyId);

    if (!companyById) {
      throw new AppError('No company found with this ID.');
    }

    const companiesUpdated = [];

    for (const service of services) {
      const serviceById = await serviceRepository.findById(service.serviceId);

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      const serviceUpdated = await serviceRepository.save({
        ...serviceById,
        company_price: service.price,
      });

      if (serviceUpdated) {
        companiesUpdated.push(serviceUpdated);
      }
    }

    return response.json(companiesUpdated);
  }
}
