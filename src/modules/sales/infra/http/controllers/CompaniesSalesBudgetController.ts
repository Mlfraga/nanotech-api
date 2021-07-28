import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompanyRepository from '@modules/companies/infra/typeorm/repositories/CompanyRepository';
import CompanyPricesRepository from '@modules/company_prices/infra/typeorm/repositories/CompanyPricesRepository';

export default class CompaniesSalesBudgetController {
  async create(request: Request, response: Response) {
    const { services, companyId } = request.body;

    let companyPrice = 0;

    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const companyRepository = container.resolve(CompanyRepository);

    const company = companyRepository.findById(companyId);

    if (!company) {
      throw new AppError('Company not found.', 404);
    }

    services.filter(async (serviceId: string) => {
      const serviceByIdAndServiceId =
        await companyPricesRepository.findByCompanyIdAndServiceId(
          String(companyId),
          String(serviceId),
        );

      if (!serviceByIdAndServiceId) {
        throw new AppError('No service found with this ID.');
      }

      companyPrice =
        Number(serviceByIdAndServiceId.price) + Number(companyPrice);
    });

    setTimeout(
      () => response.json({ companyPrice: Number(companyPrice) }),
      100,
    );
  }
}
