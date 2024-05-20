import ICreateUnitDTO from '../dtos/ICreateUnitDTO';
import { Unit } from '../infra/entities/Unit';

export default interface IUnitRepository {
  find(): Promise<Unit[] | undefined>;
  findById(id: string): Promise<Unit | undefined>;
  findByCompanyId(company_id: string): Promise<Unit[] | undefined>;
  findByNameAndCompany(companyid: string, name: string): Promise<Unit[] | undefined>;
  create(data: ICreateUnitDTO): Promise<Unit>;
  save(unit: Unit): Promise<Unit>;
  delete(id: string): Promise<void>;
}
