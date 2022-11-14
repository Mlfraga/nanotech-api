import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListWhatsappNumbersService from '@modules/whatsapp_numbers/services/ListWhatsappNumbersService';
import StoreWhatsappNumberService from '@modules/whatsapp_numbers/services/StoreWhatsappNumberService';

export default class WhatsappNumberController {
  async store(request: Request, response: Response) {
    const { numbers } = request.body;

    const storeWhatsappNumberService = container.resolve(
      StoreWhatsappNumberService,
    );

    await storeWhatsappNumberService.execute(numbers);

    return response.sendStatus(202);
  }

  async index(request: Request, response: Response) {
    const listWhatsappNumbersService = container.resolve(
      ListWhatsappNumbersService,
    );

    const numbers = await listWhatsappNumbersService.execute();

    return response.json(numbers);
  }
}
