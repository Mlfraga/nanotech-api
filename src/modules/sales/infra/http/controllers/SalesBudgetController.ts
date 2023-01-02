import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSalesBudgetService from '../services/CreateSalesBudgetService';

export default class SalesBudgetController {
  async create(request: Request, response: Response) {
    const { services } = request.body;

    const createSalesBudgetService = container.resolve(
      CreateSalesBudgetService,
    );

    const costPrice = await createSalesBudgetService.execute({
      service_ids: services,
    });

    return response.json({ costPrice });
  }
}
