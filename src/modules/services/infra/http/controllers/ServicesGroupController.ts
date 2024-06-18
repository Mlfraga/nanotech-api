import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateServiceGroupService from '../services/CreateServiceGroupService';
import { ServiceGroupViewModel } from '../view-models/service-group-view-model';
import ListServiceGroupService from '../services/ListServiceGroupService';

export default class ServicesGroupController {
 async store(request: Request, response: Response) {
   const {
      name,
      description,
      image_url,
    } = request .body;

    const createServicGroupService = container.resolve(CreateServiceGroupService);

    const serviceGroupCreated = await createServicGroupService.execute({
      name,
      description,
      imageUrl: image_url,
    });

    return response.json(ServiceGroupViewModel.toHttp(serviceGroupCreated));
  }

  async index(request: Request, response: Response) {
   const listServiceGroupService = container.resolve(ListServiceGroupService);

    const serviceGroups = await listServiceGroupService.execute({});

    const formattedServiceGroups = serviceGroups.map((serviceGroup) => ServiceGroupViewModel.toHttp(serviceGroup))

    return response.json(formattedServiceGroups);
  }
}
