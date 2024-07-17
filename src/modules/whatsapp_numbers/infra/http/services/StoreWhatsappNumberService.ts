import { injectable, inject } from 'tsyringe';

import ICreateWhatsappNumberDTO from '../../../dtos/ICreateWhatsappNumberDTO';
import IWhatsappNumberRepository from '../../../repositories/IWhatsappNumberRepository';
import { WhatsappNumber } from '../../entities/WhatsappNumber';

@injectable()
class StoreWhatsappNumberService {
  constructor(
    @inject('WhatsappNumberRepository')
    private whatsappNumberRepository: IWhatsappNumberRepository,
  ) {}

  public async execute(
    numbers: ICreateWhatsappNumberDTO[],
  ): Promise<WhatsappNumber[]> {
    const createdNumbers = [];

    await this.whatsappNumberRepository.deleteAll();

    for (const number of numbers) {
      try {
        const whatsappNumber = await this.whatsappNumberRepository.create({
          ...number,
          number: `+55${number.number}`,
        });

        createdNumbers.push(whatsappNumber);
      } catch (error) {
        console.log(error);
      }
    }

    return createdNumbers;
  }
}

export default StoreWhatsappNumberService;
