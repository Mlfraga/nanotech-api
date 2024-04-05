import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateServicesSaleService from '../services/CreateServicesSaleService';
import SendServicesSaleMessageService from '../services/SendServicesSaleMessageService';

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

    return response.json(createdServicesSale);
  }

  async sendMessage(request: Request, response: Response) {
    const { saleId } = request.params;
    console.log('saleId', saleId);

    const sendServicesSaleMessageService = container.resolve(
      SendServicesSaleMessageService,
    );

    await sendServicesSaleMessageService.execute({
      saleId,
    });

    return response.json({ ok: true });
  }
}
