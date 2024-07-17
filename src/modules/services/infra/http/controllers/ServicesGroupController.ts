import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateServiceGroupService from '../services/CreateServiceGroupService';
import { ServiceGroupViewModel } from '../view-models/service-group-view-model';
import ListServiceGroupService from '../services/ListServiceGroupService';
import ToggleServiceGroupStatusService from '../services/ToggleServiceGroupStatusService';
import UpdateServiceGroupService from '../services/UpdateServiceGroupService';

export default class ServicesGroupController {
 async store(request: Request, response: Response) {
   const {
      name,
      description,
      imageUrl,
      defaultNanotechPrice,
     companiesToLink,
     category_id
    } = request .body;

    const createServicGroupService = container.resolve(CreateServiceGroupService);

    const serviceGroupCreated = await createServicGroupService.execute({
      name,
      description,
      imageUrl,
      defaultNanotechPrice,
      companiesToLink,
      category_id
    });

    return response.json(ServiceGroupViewModel.toHttp(serviceGroupCreated));
  }

  async index(request: Request, response: Response) {
    const { enabled } = request.query;

   const listServiceGroupService = container.resolve(ListServiceGroupService);

    const serviceGroups = await listServiceGroupService.execute({ enabled: enabled as any as boolean});

    const formattedServiceGroups = serviceGroups.map((serviceGroup) => ServiceGroupViewModel.toHttp(serviceGroup))

    return response.json(formattedServiceGroups);
  }

  async toggleNanotechServiceGroupStatus(request: Request, response: Response) {
    const { id } = request.params;

   const toggleServiceGroupStatusService = container.resolve(ToggleServiceGroupStatusService);

    await toggleServiceGroupStatusService.execute({ id });

    return response.sendStatus(204);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, description, category_id } = request.body;

   const updateServiceGroupService = container.resolve(UpdateServiceGroupService);

    await updateServiceGroupService.execute({ id, name, description, category_id });

    return response.sendStatus(204);
  }
}
