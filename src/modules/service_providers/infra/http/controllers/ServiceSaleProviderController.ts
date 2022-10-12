import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSaleServiceProvidersService from '@modules/service_providers/services/CreateSaleServiceProvidersService';
import ListProvidersBySaleService from '@modules/service_providers/services/ListProvidersBySaleService';
import ListSalesByProviderService from '@modules/service_providers/services/ListSalesByProviderService';

export default class ServiceSaleProviderController {
  async store(request: Request, response: Response) {
    const { date_to_be_done, sale_ids, sale_service_provider_profile_ids } =
      request.body;

    const createSaleServiceProviderService = container.resolve(
      CreateSaleServiceProvidersService,
    );

    const createSaleServiceProviders =
      await createSaleServiceProviderService.execute({
        sale_ids,
        date_to_be_done,
        profile_ids: sale_service_provider_profile_ids,
      });

    return response.json(createSaleServiceProviders);
  }

  async listBySaleId(request: Request, response: Response) {
    const { sale_id } = request.params;

    const listBySaleService = container.resolve(ListProvidersBySaleService);

    const serviceSalesProviders = await listBySaleService.execute(sale_id);

    return response.json(serviceSalesProviders);
  }

  async showSales(request: Request, response: Response) {
    const { listFrom } = request.query;

    const listSalesByProviderService = container.resolve(
      ListSalesByProviderService,
    );

    const salesByProvider = await listSalesByProviderService.execute({
      listFrom: listFrom as 'yesterday' | 'today' | 'tomorrow',
      profile_id: request.user.profile_id,
    });

    return response.json(salesByProvider);
  }

  async showProvidersBySale(request: Request, response: Response) {
    const { sale_id } = request.params;

    const listProvidersBySaleService = container.resolve(
      ListProvidersBySaleService,
    );

    const providersBySale = await listProvidersBySaleService.execute(sale_id);

    return response.json(providersBySale);
  }
}
