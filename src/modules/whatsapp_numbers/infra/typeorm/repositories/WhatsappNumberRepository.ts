import { getRepository, Repository } from 'typeorm';

import ICreateWhatsappNumberDTO from '../../../dtos/ICreateWhatsappNumberDTO';
import IWhatsappNumberRepository from '../../../repositories/IWhatsappNumberRepository';
import WhatsappNumber from '../entities/WhatsappNumber';

class WhatsappNumberRepository implements IWhatsappNumberRepository {
  private ormRepository: Repository<WhatsappNumber>;

  constructor() {
    this.ormRepository = getRepository(WhatsappNumber);
  }

  public async find(): Promise<WhatsappNumber[] | undefined> {
    const whatsappNumber = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      relations: ['company'],
    });

    return whatsappNumber;
  }

  public async findById(id: string): Promise<WhatsappNumber | undefined> {
    const whatsappNumber = await this.ormRepository.findOne(id);

    return whatsappNumber;
  }

  public async findByNumber(
    number: string,
  ): Promise<WhatsappNumber | undefined> {
    const whatsappNumber = await this.ormRepository.findOne({ number });

    return whatsappNumber;
  }

  public async findByCompany(company_id: string): Promise<WhatsappNumber[]> {
    const whatsappNumbers = await this.ormRepository.find({
      company_id,
      restricted_to_especific_company: true,
    });

    return whatsappNumbers;
  }

  public async findAllGlobalNumbers(): Promise<WhatsappNumber[]> {
    const whatsappNumbers = await this.ormRepository.find({
      restricted_to_especific_company: false,
    });

    return whatsappNumbers;
  }

  public async create(data: ICreateWhatsappNumberDTO): Promise<WhatsappNumber> {
    const whatsappNumber = this.ormRepository.create(data);

    await this.ormRepository.save(whatsappNumber);

    return whatsappNumber;
  }

  public async save(user: WhatsappNumber): Promise<WhatsappNumber> {
    return this.ormRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default WhatsappNumberRepository;
