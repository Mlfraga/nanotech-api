import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export interface IUserFilters {
  role?: string;
  name?: string;
  telephone?: string;
  company_id?: string;
  enabled?: boolean;
}

export default interface IUserRepository {
  find({
    role,
    name,
    telephone,
    company_id,
    enabled,
  }: IUserFilters): Promise<User[] | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  findByCompany(company_id: string): Promise<User[] | undefined>;
  delete(id: string): Promise<void>;
}
