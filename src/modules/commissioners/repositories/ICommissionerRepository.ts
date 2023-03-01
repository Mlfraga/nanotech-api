import ICreateCommissionerDTO from '../dtos/ICreateCommissionerDTO';
import Commissioner from '../infra/typeorm/entities/Commissioner';

export default interface ICommissionerRepository {
  find(): Promise<Commissioner[]>;
  findById(id: string): Promise<Commissioner | undefined>;
  findByCompany(company_id: string): Promise<Commissioner[]>;
  create(data: ICreateCommissionerDTO): Promise<Commissioner>;
  save(commissioner: Commissioner): Promise<Commissioner>;
  delete(id: string): Promise<void>;
}
