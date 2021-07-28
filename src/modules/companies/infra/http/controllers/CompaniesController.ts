import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CpfCnpjUtils from '@shared/utils/CpfCnpjUtils';

import CompanyRepository from '../../typeorm/repositories/CompanyRepository';

export default class CompanyController {
  async index(request: Request, response: Response) {
    const { id } = request.params;

    const companyRepository = container.resolve(CompanyRepository);

    if (id) {
      const company = await companyRepository.findById(String(id));

      if (!company) {
        return response.status(404).json({ error: 'Company not found.' });
      }

      return response.json(company);
    }

    const companies = await companyRepository.find();

    return response.json(companies);
  }

  async store(request: Request, response: Response) {
    const { name, telephone, cnpj, client_identifier } = request.body;

    const companyRepository = container.resolve(CompanyRepository);

    const isCnpjValid = CpfCnpjUtils.isCnpjValid(cnpj);

    if (!isCnpjValid) {
      throw new AppError('Invalid CNPJ.', 409);
    }

    const companyByName = await companyRepository.findByName(name);

    if (companyByName) {
      throw new AppError('Already has a company with this name.', 409);
    }

    const companyByCnpj = await companyRepository.findByCnpj(cnpj);

    if (companyByCnpj) {
      throw new AppError('Already has a company with this CNPJ.', 409);
    }

    const company = await companyRepository.create({
      name,
      telephone,
      cnpj,
      client_identifier: String(client_identifier).toUpperCase(),
    });

    return response.json(company);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, telephone, cnpj, client_identifier } = request.body;

    const companyRepository = container.resolve(CompanyRepository);

    const companyExists = await companyRepository.findById(String(id));

    if (!companyExists) {
      throw new AppError('Does not exist a company with this id.');
    }

    const updatedCompany = await companyRepository.save({
      ...companyExists,
      ...(client_identifier && { client_identifier }),
      ...(name && { name }),
      ...(telephone && { telephone }),
      ...(cnpj && { cnpj }),
    });

    return response.json(updatedCompany);
  }
}
