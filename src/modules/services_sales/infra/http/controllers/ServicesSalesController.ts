import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateServicesSaleService from '../services/CreateServicesSaleService';
import SendServicesSaleMessageService from '../services/SendServicesSaleMessageService';
import { ServiceSalesProviderViewModel } from '../view-models/services-sales-view-model';

export default class ServicesSalesController {
  async store(request: Request, response: Response) {
    const { saleId, serviceIds, referral_data, isReferred } = request.body;

    const createServicesSaleService = container.resolve(
      CreateServicesSaleService,
    );

    const createdServicesSale = await createServicesSaleService.execute({
      saleId,
      isReferred,
      serviceIds,
      referral_data,
    });

    const formattedServiceSales = createdServicesSale.map(serviceSale => ServiceSalesProviderViewModel.toHttp(serviceSale));

    return response.json(formattedServiceSales);
  }

  async sendMessage(request: Request, response: Response) {
    const { saleId } = request.params;

    const sendServicesSaleMessageService = container.resolve(
      SendServicesSaleMessageService,
    );

    await sendServicesSaleMessageService.execute({
      saleId,
    });

    return response.json({ ok: true });
  }
}
