import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateServicesSaleService from '../services/CreateServicesSaleService';

export default class ServicesSalesController {
  async store(request: Request, response: Response) {
    const { saleId, serviceIds } = request.body;

    const createServicesSaleService = container.resolve(
      CreateServicesSaleService,
    );

    const createdServicesSale = await createServicesSaleService.execute({
      saleId,
      serviceIds,
    });

    return response.json(createdServicesSale);
  }
}
