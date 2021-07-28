import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '@modules/services/infra/typeorm/repositories/ServiceRepository';

export default class SalesBudgetController {
  async create(request: Request, response: Response) {
    const { services } = request.body;

    const serviceRepository = container.resolve(ServiceRepository);

    let costPrice = 0;

    services.forEach(async (id: string): Promise<void> => {
      const serviceById = await serviceRepository.findById(id);

      if (!serviceById) {
        throw new AppError('No service found with this ID.');
      }

      costPrice = Number(serviceById.price) + Number(costPrice);
    });

    setTimeout(() => response.json({ costPrice: Number(costPrice) }), 100);
  }
}
