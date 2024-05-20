import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '../../../../services/infra/prisma/repositories/service-provider-repository';
import CompanyPricesRepository from '../../prisma/repositories/company-prices-repository';
import { CompanyPricesViewModel } from '../../view-models/company-prices-view-model';
import { Service } from '@modules/services/infra/entities/Service';

export default class CompanyPricesController {
  async store(request: Request, response: Response) {
    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const serviceRepository = container.resolve(ServiceRepository);

    const { companyId, services } = request.body;

    const companyById = companyPricesRepository.findById(companyId);

    if (!companyById) {
      throw new AppError('No company found with this ID.');
    }

    const companiesUpdated: Service[] = [];

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

    return response.json(CompanyPricesViewModel.toHttp(companiesUpdated));
  }
}
