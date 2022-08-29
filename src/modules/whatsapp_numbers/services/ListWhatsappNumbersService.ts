import { injectable, inject } from 'tsyringe';

import WhatsappNumber from '../infra/typeorm/entities/WhatsappNumber';
import IWhatsappNumberRepository from '../repositories/IWhatsappNumberRepository';

@injectable()
class ListWhatsappNumbersService {
  constructor(
    @inject('WhatsappNumberRepository')
    private whatsappNumberRepository: IWhatsappNumberRepository,
  ) {}

  public async execute(): Promise<WhatsappNumber[] | undefined> {
    const whatsappNumbers = await this.whatsappNumberRepository.find();

    return whatsappNumbers;
  }
}

export default ListWhatsappNumbersService;
