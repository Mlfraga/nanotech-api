import { injectable, inject } from 'tsyringe';

import IWhatsappNumberRepository from '../../../repositories/IWhatsappNumberRepository';
import { WhatsappNumber } from '../../entities/WhatsappNumber';

@injectable()
class ListWhatsappNumbersService {
  constructor(
    @inject('WhatsappNumberRepository')
    private whatsappNumberRepository: IWhatsappNumberRepository,
  ) {}

  public async execute(): Promise<WhatsappNumber[]> {
    const whatsappNumbers = await this.whatsappNumberRepository.find();

    return whatsappNumbers;
  }
}

export default ListWhatsappNumbersService;
