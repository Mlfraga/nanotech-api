import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUnitService from '../services/CreateUnitService';
import UpdateUnitService from '../services/UpdateUnitService';

export default class UnitController {
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, telephone, client_identifier } = request.body;

    const updateUnitService = container.resolve(UpdateUnitService);

    const unit = await updateUnitService.execute({
      id,
      client_identifier,
      name,
      telephone,
    });

    return response.json(unit);
  }

  async store(request: Request, response: Response) {
    const { name, telephone, companyId, client_identifier } = request.body;

    const createUnitService = container.resolve(CreateUnitService);

    await createUnitService.execute({
      companyId,
      client_identifier,
      name,
      telephone,
    });

    return response.sendStatus(202);
  }
}
