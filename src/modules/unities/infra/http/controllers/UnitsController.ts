import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import CompanyRepository from '@modules/companies/infra/typeorm/repositories/CompanyRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import UnitRepository from '../../typeorm/repositories/UnitRepository';

export default class UnitController {
  async index(request: Request, response: Response) {
    const unitRepository = container.resolve(UnitRepository);
    const userRepository = container.resolve(UserRepository);
    const user = await userRepository.findById(request.user.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'ADMIN') {
      const units = await unitRepository.find();

      return response.json(units);
    }

    const units = await unitRepository.findByCompanyId(user.profile.company_id);

    return response.json(units);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, telephone, client_identifier } = request.body;

    const unitRepository = container.resolve(UnitRepository);

    const unitById = await unitRepository.findById(String(id));

    if (!unitById) {
      throw new AppError('Does not exist a unit with this id.');
    }

    const unit = await unitRepository.save({
      ...unitById,
      ...(name && { name }),
      ...(telephone && { telephone }),
      ...(client_identifier && { client_identifier }),
    });

    return response.json(unit);
  }

  async store(request: Request, response: Response) {
    const { name, telephone, companyId, client_identifier } = request.body;

    const unitRepository = container.resolve(UnitRepository);
    const companyRepository = container.resolve(CompanyRepository);

    const company = await companyRepository.findById(companyId);

    if (!company) {
      throw new AppError('Company was not found.');
    }

    const unitByName = await unitRepository.findByNameAndCompany(
      companyId,
      name,
    );

    if (unitByName && unitByName.length > 0) {
      throw new AppError('Already has a unit of this company with that name.');
    }

    const unit = await unitRepository.create({
      name,
      telephone,
      company_id: companyId,
      client_identifier: String(client_identifier).toUpperCase(),
    });

    return response.json(unit);
  }
}
