import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowUnitsByCompanyService from '../services/ShowUnitsByCompanyService';
import { UnitViewModel } from '../view-models/unities-view-model';

export default class UnitController {
  async index(request: Request, response: Response) {
    const { company_id } = request.params;

    const showUnitsByCompanyService = container.resolve(
      ShowUnitsByCompanyService,
    );

    const units = await showUnitsByCompanyService.execute({ company_id });

    const formattedUnities = units.map(unit => UnitViewModel.toHttp(unit));

    return response.json(formattedUnities);
  }
}
