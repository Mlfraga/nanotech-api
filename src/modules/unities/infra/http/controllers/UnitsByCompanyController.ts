import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowUnitsByCompanyService from '../../../services/ShowUnitsByCompanyService';

export default class UnitController {
  async index(request: Request, response: Response) {
    const { company_id } = request.params;

    const showUnitsByCompanyService = container.resolve(
      ShowUnitsByCompanyService,
    );

    const units = await showUnitsByCompanyService.execute({ company_id });

    return response.json(units);
  }
}
