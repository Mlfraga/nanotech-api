import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ToggleServiceEnabledService from '@modules/services/infra/http/services/ToggleServiceEnabledService';

import CreateServiceService from '../services/CreateServicesService';
import ListServicesByCompanyService from '../services/ListServicesByCompanyService';
import UpdateServiceService from '../services/UpdateServiceService';
import { ServicesViewModel } from '../view-models/services-view-model';

export default class ServicesController {
  async index(request: Request, response: Response) {
    const { companyId } = request.params;
    const { showDisabled } = request.query;

    const listServicesByCompanyService = container.resolve(
      ListServicesByCompanyService,
    );

    const services = await listServicesByCompanyService.execute({
      companyId,
      showDisabled: Boolean(showDisabled),
    });

    const formattedServices = services.map(service => ServicesViewModel.toHttp(service));

    return response.json(formattedServices);
  }

  async store(request: Request, response: Response) {
    const { name, price, company_id, commission_amount, service_group_id } = request.body;

    const createServiceService = container.resolve(CreateServiceService);

    const createdService = await createServiceService.execute({
      name,
      price,
      company_id,
      commission_amount,
      service_group_id
    });

    return response.json(ServicesViewModel.toHttp(createdService));
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, price, company_price, commission_amount } = request.body;

    const updateServiceService = container.resolve(UpdateServiceService);

    const updatedService = await updateServiceService.execute({
      id,
      name,
      price,
      company_price,
      commission_amount,
    });

    return response.json(ServicesViewModel.toHttp(updatedService));
  }

  async enable(request: Request, response: Response) {
    const { id } = request.params;

    const toggleServiceEnabledService = container.resolve(
      ToggleServiceEnabledService,
    );

    await toggleServiceEnabledService.execute({
      id,
      enabled: true,
    });

    return response.sendStatus(202);
  }

  async disable(request: Request, response: Response) {
    const { id } = request.params;

    const toggleServiceEnabledService = container.resolve(
      ToggleServiceEnabledService,
    );

    await toggleServiceEnabledService.execute({
      id,
      enabled: false,
    });

    return response.sendStatus(202);
  }
}
