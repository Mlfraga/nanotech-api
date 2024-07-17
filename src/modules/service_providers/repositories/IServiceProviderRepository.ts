import ICreateServiceProviderDTO from '../dtos/ICreateServiceProviderDTO';
import { ServiceProvider } from '../infra/entities/ServiceProvider';

export default interface IServiceProviderRepository {
  find(): Promise<ServiceProvider[] | undefined>;
  findById(id: string): Promise<ServiceProvider | undefined>;
  findBySale(sale_id: string): Promise<ServiceProvider[]>;
  findByProviderId(provider_id: string,listFrom?: 'yesterday' | 'today' | 'tomorrow',): Promise<ServiceProvider[]>;
  findByProviderAndSaleId(provider_id: string,sale_id: string,): Promise<ServiceProvider | undefined>;
  create(data: ICreateServiceProviderDTO): Promise<ServiceProvider>;
  save(saleServiceProvider: ServiceProvider): Promise<ServiceProvider>;
  delete(id: string): Promise<void>;
  deleteBySale(sale_id: string): Promise<void>;
}
