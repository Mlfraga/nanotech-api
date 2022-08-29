import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICreateWhatsappNumberDTO from '../dtos/ICreateWhatsappNumberDTO';
import WhatsappNumber from '../infra/typeorm/entities/WhatsappNumber';
import IWhatsappNumberRepository from '../repositories/IWhatsappNumberRepository';

@injectable()
class StoreWhatsappNumberService {
  constructor(
    @inject('WhatsappNumberRepository')
    private whatsappNumberRepository: IWhatsappNumberRepository,
  ) {}

  public async execute(
    new_whatsapp_number: ICreateWhatsappNumberDTO,
  ): Promise<WhatsappNumber> {
    const isWhatsappNumberAlreadyExists =
      await this.whatsappNumberRepository.findByNumber(
        new_whatsapp_number.number,
      );

    if (isWhatsappNumberAlreadyExists) {
      throw new AppError('This number already exists.', 402);
    }

    const whatsappNumber = await this.whatsappNumberRepository.create(
      new_whatsapp_number,
    );

    return whatsappNumber;
  }
}

export default StoreWhatsappNumberService;
