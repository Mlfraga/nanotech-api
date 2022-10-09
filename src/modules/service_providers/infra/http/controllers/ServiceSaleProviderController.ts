import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSaleServiceProvidersService from '@modules/service_providers/services/CreateSaleServiceProvidersService';
import ListSalesByServiceProvider from '@modules/service_providers/services/ListSalesByServiceProvider';

export default class ServiceSaleProviderController {
  async store(request: Request, response: Response) {
    const { saleId, saleServiceProviderProfileIds } = request.body;

    const createSaleServiceProviderService = container.resolve(
      CreateSaleServiceProvidersService,
    );

    const createSaleServiceProviders =
      await createSaleServiceProviderService.execute({
        sale_id: saleId,
        profile_ids: saleServiceProviderProfileIds,
      });

    return response.json(createSaleServiceProviders);
  }

  async show(request: Request, response: Response) {
    const listSalesByServiceProvider = container.resolve(
      ListSalesByServiceProvider,
    );

    const salesByProvider = await listSalesByServiceProvider.execute({
      profile_id: request.user.profile_id,
    });

    return response.json(salesByProvider);
  }
}
