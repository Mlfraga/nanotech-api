import ICreateCompanyPricesDTO from '../dtos/ICreateCompanyPricesDTO';
import { CompanyPrice } from '../infra/entities/CompanyPrice';

export default interface ICompanyPriceRepository {
  find(): Promise<CompanyPrice[]>;
  findByCompanyId(companyId: string): Promise<CompanyPrice[]>;
  findByCompanyIdAndServiceId(
    company_id: string,
    service_id: string,
  ): Promise<CompanyPrice | undefined>;
  findById(id: string): Promise<CompanyPrice | undefined>;
  create(data: ICreateCompanyPricesDTO): Promise<CompanyPrice>;
  save(companyPrices: CompanyPrice): Promise<CompanyPrice>;
  delete(id: string): Promise<void>;
}
