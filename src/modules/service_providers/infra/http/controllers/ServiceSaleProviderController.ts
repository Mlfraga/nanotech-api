import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSaleServiceProvidersService from '@modules/service_providers/services/CreateSaleServiceProvidersService';

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
}
