import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCompanyService from '../services/CreateCompanyService';
import FindCompanyById from '../services/FindCompanyById';
import ListCompaniesService from '../services/ListCompaniesService';
import ShowCompanyService from '../services/ShowCompanyService';
import UpdateCompanyService from '../services/UpdateCompanyService';

export default class CompanyController {
  async index(request: Request, response: Response) {
    const listCompaniesService = container.resolve(ListCompaniesService);

    const companies = await listCompaniesService.execute();

    return response.json(companies);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const showCompanyService = container.resolve(ShowCompanyService);

    const company = await showCompanyService.execute({ id });

    return response.json(company);
  }

  async find(request: Request, response: Response) {
    const { id } = request.params;

    const findCompanyById = container.resolve(FindCompanyById);

    const company = await findCompanyById.execute({ id });

    return response.json(company);
  }

  async store(request: Request, response: Response) {
    const { name, telephone, cnpj, client_identifier } = request.body;

    const createCompanyService = container.resolve(CreateCompanyService);

    const company = await createCompanyService.execute({
      name,
      telephone,
      cnpj,
      client_identifier,
    });

    return response.json(company);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, telephone, cnpj, client_identifier } = request.body;

    const updateCompanyService = container.resolve(UpdateCompanyService);

    const updatedCompany = await updateCompanyService.execute({
      id,
      name,
      telephone,
      cnpj,
      client_identifier,
    });

    return response.json(updatedCompany);
  }
}
