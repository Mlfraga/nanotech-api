import ICreateServiceProviderDTO from '../dtos/ICreateServiceProviderDTO';
import SaleServiceProvider from '../infra/typeorm/entities/SaleServiceProvider';

export default interface ICarRepository {
  find(): Promise<SaleServiceProvider[] | undefined>;
  findById(id: string): Promise<SaleServiceProvider | undefined>;
  findByProviderId(provider_id: string): Promise<SaleServiceProvider[]>;
  create(data: ICreateServiceProviderDTO): Promise<SaleServiceProvider>;
  save(saleServiceProvider: SaleServiceProvider): Promise<SaleServiceProvider>;
  delete(id: string): Promise<void>;
}
