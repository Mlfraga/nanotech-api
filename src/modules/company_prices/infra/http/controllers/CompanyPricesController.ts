import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '../../../../services/infra/typeorm/repositories/ServiceRepository';
import CompanyPrices from '../../typeorm/entities/CompanyPrices';
import CompanyPricesRepository from '../../typeorm/repositories/CompanyPricesRepository';

interface IServices {
  serviceId: string;
  price: number;
}

interface ICreateCompanyServices {
  companyId: string;
  services: Array<{
    serviceId: string;
    price: number;
  }>;
}

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

    const promises: Promise<ICreateCompanyServices>[] = services.map(
      async (service: IServices) => {
        const serviceById = serviceRepository.findById(service.serviceId);

        if (!serviceById) {
          throw new AppError('No service found with this ID.');
        }

        const serviceByCompany =
          await companyPricesRepository.findByCompanyIdAndServiceId(
            companyId,
            service.serviceId,
          );

        if (serviceByCompany) {
          throw new AppError(
            'This service was already created by this company.',
          );
        }

        const data = await companyPricesRepository.create({
          price: service.price,
          company_id: companyId,
          service_id: service.serviceId,
        });

        if (!data) {
          return null;
        }

        return data;
      },
    );

    const companyService = await Promise.all<ICreateCompanyServices>(promises);

    return response.json(companyService);
  }
}
