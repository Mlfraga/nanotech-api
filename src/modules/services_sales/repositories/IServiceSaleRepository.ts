import ICreateServiceSaleDTO from '../dtos/ICreateServiceSaleDTO';
import { ServiceSale } from '../infra/entities/ServiceSale';

export default interface IServiceSaleRepository {
  find(): Promise<ServiceSale[] | undefined>;
  findById(id: string): Promise<ServiceSale | undefined>;
  findBySale(id: string): Promise<ServiceSale[]>;
  create(data: ICreateServiceSaleDTO): Promise<ServiceSale>;
  save(unit: ServiceSale): Promise<ServiceSale>;
  delete(id: string): Promise<void>;
  filter(
    serviceId: string,
    companyId: string,
    unitId: string,
    startDeliveryDate: Date,
    endDeliveryDate: Date,
  ): Promise<ServiceSale[]>;
}
