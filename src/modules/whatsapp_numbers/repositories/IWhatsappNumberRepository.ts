import ICreateWhatsappNumberDTO from '../dtos/ICreateWhatsappNumberDTO';
import WhatsappNumber from '../infra/typeorm/entities/WhatsappNumber';

export default interface IWhatsappNumberRepository {
  find(): Promise<WhatsappNumber[] | undefined>;
  findById(id: string): Promise<WhatsappNumber | undefined>;
  findByNumber(number: string): Promise<WhatsappNumber | undefined>;
  findByCompany(company_id: string): Promise<WhatsappNumber[]>;
  findAllGlobalNumbers(): Promise<WhatsappNumber[]>;
  create(data: ICreateWhatsappNumberDTO): Promise<WhatsappNumber>;
  save(car: WhatsappNumber): Promise<WhatsappNumber>;
  delete(id: string): Promise<void>;
  deleteAll(): Promise<void>;
}
