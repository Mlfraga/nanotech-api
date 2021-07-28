import ICreateCompanyPricesDTO from '../dtos/ICreateCompanyPricesDTO';
import CompanyPrices from '../infra/typeorm/entities/CompanyPrices';

export default interface IServiceRepository {
  find(): Promise<CompanyPrices[] | undefined>;
  findByCompanyId(companyId: string): Promise<CompanyPrices[] | undefined>;
  findByCompanyIdAndServiceId(
    company_id: string,
    service_id: string,
  ): Promise<CompanyPrices | undefined>;
  findById(id: string): Promise<CompanyPrices | undefined>;
  create(data: ICreateCompanyPricesDTO): Promise<CompanyPrices>;
  save(companyPrices: CompanyPrices): Promise<CompanyPrices>;
  delete(id: string): Promise<void>;
}
