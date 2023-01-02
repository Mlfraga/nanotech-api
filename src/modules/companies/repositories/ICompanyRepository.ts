import ICreateCompanyDTO from '../dtos/ICreateCompanyDTO';
import Company from '../infra/typeorm/entities/Company';

export default interface ICompanyRepository {
  find(): Promise<Company[]>;
  findById(id: string): Promise<Company | undefined>;
  findByCnpj(cnpj: string): Promise<Company | undefined>;
  findByName(name: string): Promise<Company | undefined>;
  create(data: ICreateCompanyDTO): Promise<Company>;
  save(company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}
