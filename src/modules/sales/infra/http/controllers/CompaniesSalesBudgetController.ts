import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompanyRepository from '@modules/companies/infra/typeorm/repositories/CompanyRepository';
import ServiceRepository from '@modules/services/infra/typeorm/repositories/ServiceRepository';

export default class CompaniesSalesBudgetController {
  async create(request: Request, response: Response) {
    const { services, companyId } = request.body;

    let companyPrice = 0;

    const serviceRepository = container.resolve(ServiceRepository);
    const companyRepository = container.resolve(CompanyRepository);

    const company = companyRepository.findById(companyId);

    if (!company) {
      throw new AppError('Company not found.', 404);
    }

    for (const serviceId of services) {
      const serviceById = await serviceRepository.findById(String(serviceId));

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      companyPrice = Number(serviceById.company_price) + Number(companyPrice);
    }

    return response.json({ companyPrice: Number(companyPrice) });
  }
}
