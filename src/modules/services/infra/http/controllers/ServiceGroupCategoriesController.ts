import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ServicesViewModel } from '../view-models/services-view-model';
import ListServiceGroupCategoriesService from '../services/ListServiceGroupCategoriesService';
import { ServiceGroupCategoriesViewModel } from '../view-models/service-group-categories-view-model';
import CreateServiceGroupCategoryService from '../services/CreateServiceGroupCategoryService';

export default class ServiceCategoriessController {
  async index(request: Request, response: Response) {
    const listServiceGroupCategoriesService = container.resolve(
      ListServiceGroupCategoriesService,
    );

    const serviceGroupCategories = await listServiceGroupCategoriesService.execute();

    const formattedServiceGroupCategories = serviceGroupCategories.map(serviceGroupCategory => ServiceGroupCategoriesViewModel.toHttp(serviceGroupCategory));

    return response.json(formattedServiceGroupCategories);
  }

  async store(request: Request, response: Response) {
    const { name } = request.body;

    const createServiceGroupCategoryService = container.resolve(CreateServiceGroupCategoryService);

    const createdServiceGroupCategory = await createServiceGroupCategoryService.execute({name});

    return response.json(ServiceGroupCategoriesViewModel.toHttp(createdServiceGroupCategory));
  }
}
