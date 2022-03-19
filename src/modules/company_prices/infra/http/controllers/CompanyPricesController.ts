import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '../../../../services/infra/typeorm/repositories/ServiceRepository';
import CompanyPrices from '../../typeorm/entities/CompanyPrices';
import CompanyPricesRepository from '../../typeorm/repositories/CompanyPricesRepository';

export default class CompanyPricesController {
  async index(request: Request, response: Response) {
    const companyPricesRepository = container.resolve(CompanyPricesRepository);

    const prices = await companyPricesRepository.find();

    return response.json(prices);
  }

  async update(request: Request, response: Response) {
    const servicesData: Array<{
      companyServiceId: string;
      price: number;
    }> = request.body;

    const companyPricesRepository = container.resolve(CompanyPricesRepository);

    const promises: Promise<CompanyPrices | null>[] = servicesData.map(
      async ({ companyServiceId, price }) => {
        const companyServiceById = await companyPricesRepository.findById(
          companyServiceId,
        );

        if (!companyServiceById) {
          return null;
        }

        const companyServices = await companyPricesRepository.save({
          ...companyServiceById,
          price,
        });

        return companyServices;
      },
    );

    const updatedServices = await Promise.all(
      promises.filter(promise => promise !== null),
    );

    return response.json(updatedServices);
  }

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
