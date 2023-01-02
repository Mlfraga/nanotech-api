import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCompanySalesBudgetService from '../services/CreateCompanySalesBudgetService';

export default class CompaniesSalesBudgetController {
  async create(request: Request, response: Response) {
    const { services } = request.body;

    const createCompanySalesBudgetService = container.resolve(
      CreateCompanySalesBudgetService,
    );

    const companyPrice = createCompanySalesBudgetService.execute({
      services,
    });

    return response.json({ companyPrice: Number(companyPrice) });
  }
}
