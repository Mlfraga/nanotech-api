import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceRepository from '../../typeorm/repositories/ServiceRepository';

export default class ServicesController {
  async index(request: Request, response: Response) {
    const { companyId } = request.params;

    const serviceRepository = container.resolve(ServiceRepository);

    const services = await serviceRepository.findByCompanyId(companyId);

    return response.json(services);
  }

  async store(request: Request, response: Response) {
    const { name, price, company_id } = request.body;

    const serviceRepository = container.resolve(ServiceRepository);

    const service = await serviceRepository.create({
      name,
      price,
      company_id,
    });

    return response.json(service);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, price, company_price } = request.body;

    const serviceRepository = container.resolve(ServiceRepository);

    const serviceById = await serviceRepository.findById(String(id));

    if (!serviceById) {
      throw new AppError('Service does not exists.', 404);
    }

    const service = await serviceRepository.save({
      ...serviceById,
      ...(name && { name }),
      ...(price && { price }),
      ...(company_price && { company_price }),
    });

    return response.json(service);
  }
}
