import ICreateServiceProviderDTO from '../dtos/ICreateServiceProviderDTO';
import SaleServiceProvider from '../infra/typeorm/entities/SaleServiceProvider';

export default interface ICarRepository {
  find(): Promise<SaleServiceProvider[] | undefined>;
  findById(id: string): Promise<SaleServiceProvider | undefined>;
  findBySale(sale_id: string): Promise<SaleServiceProvider[]>;
  findByProviderId(
    provider_id: string,
    listFrom?: 'yesterday' | 'today' | 'tomorrow',
  ): Promise<SaleServiceProvider[]>;
  findByProviderAndSaleId(
    provider_id: string,
    sale_id: string,
  ): Promise<SaleServiceProvider | undefined>;
  create(data: ICreateServiceProviderDTO): Promise<SaleServiceProvider>;
  save(saleServiceProvider: SaleServiceProvider): Promise<SaleServiceProvider>;
  delete(id: string): Promise<void>;
}
