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

    const serviceByName = await serviceRepository.findByName(name);

    if (serviceByName) {
      throw new AppError('Already has a service with this name.');
    }

    const service = await serviceRepository.create({
      name,
      price,
      company_id,
    });

    return response.json(service);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, price } = request.body;

    const serviceRepository = container.resolve(ServiceRepository);

    if (name) {
      const serviceByName = await serviceRepository.findByName(name);

      if (serviceByName) {
        throw new AppError('Already has a service with this name.', 409);
      }
    }

    const serviceById = await serviceRepository.findById(String(id));

    if (!serviceById) {
      throw new AppError('Service does not exists.', 404);
    }

    const service = await serviceRepository.save({
      ...serviceById,
      ...(name && { name }),
      ...(price && { price }),
    });

    return response.json(service);
  }
}
