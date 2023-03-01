import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCommissionerService from '../services/CreateCommissionerService';
import ListCommissionerService from '../services/ListCommissionerService';
import UpdateCommissionerEnabledService from '../services/UpdateCommissionerEnabledService';
import UpdateCommissionerService from '../services/UpdateCommissionerService';

export default class CommissionerController {
  async index(request: Request, response: Response) {
    const { company_id } = request.params;

    const listCommissionerService = container.resolve(ListCommissionerService);

    const commissioners = await listCommissionerService.execute({ company_id });

    return response.json(commissioners);
  }

  async store(request: Request, response: Response) {
    const { pix_key, pix_key_type, name, telephone, company_id } = request.body;

    const createCommissionerService = container.resolve(
      CreateCommissionerService,
    );

    const commisioner = await createCommissionerService.execute({
      pix_key,
      pix_key_type,
      name,
      telephone,
      company_id,
    });

    return response.json(commisioner);
  }

  async update(request: Request, response: Response) {
    const { pix_key, pix_key_type, name, telephone, enabled } = request.body;
    const { id } = request.params;

    const updateCommissionerService = container.resolve(
      UpdateCommissionerService,
    );

    const updatedCommissioner = await updateCommissionerService.execute({
      pix_key,
      pix_key_type,
      name,
      telephone,
      id,
      enabled,
    });

    return response.json(updatedCommissioner);
  }

  async updateEnabled(request: Request, response: Response) {
    const { enabled } = request.body;
    const { id } = request.params;

    const updateCommissionerEnabledService = container.resolve(
      UpdateCommissionerEnabledService,
    );

    const updatedCommissioner = await updateCommissionerEnabledService.execute({
      id,
      enabled,
    });

    return response.json(updatedCommissioner);
  }
}
