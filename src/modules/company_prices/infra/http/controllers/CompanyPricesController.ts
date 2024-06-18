import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '../../../../services/infra/prisma/repositories/service-repository';
import CompanyPricesRepository from '../../prisma/repositories/company-prices-repository';
import { Service } from '@modules/services/infra/entities/Service';
import { ServicesViewModel } from '@modules/services/infra/http/view-models/services-view-model';

export default class CompanyPricesController {
  async store(request: Request, response: Response) {
    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const serviceRepository = container.resolve(ServiceRepository);

    const { companyId, services } = request.body;

    const companyById = companyPricesRepository.findById(companyId);

    if (!companyById) {
      throw new AppError('No company found with this ID.');
    }

    const updatedServices: Service[] = [];
    console.log("🚀 ~ CompanyPricesController ~ store ~ services:", services)

    for (const service of services) {
      const serviceById = await serviceRepository.findById(service.serviceId);

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }
      console.log("🚀 ~ CompanyPricesController ~ store ~ serviceById:", serviceById)

      serviceById.company_price = service.price;
      console.log("🚀 ~ CompanyPricesController ~ store ~ serviceById:", serviceById)
      console.log("🚀 ~ CompanyPricesController ~ store ~ service.price:", service.price)

      const serviceUpdated = await serviceRepository.save(serviceById);
      console.log("🚀 ~ CompanyPricesController ~ store ~ serviceUpdated:", serviceUpdated)

      if (serviceUpdated) {
        updatedServices.push(serviceUpdated);
      }
    }

    const formattedServices = updatedServices.map(service => {
      return ServicesViewModel.toHttp(service);
    });

    return response.json(formattedServices);
  }
}
