import ICreateServiceDTO from '../dtos/ICreateServiceDTO';
import User from '../infra/typeorm/entities/Service';

export default interface IServiceRepository {
  find(): Promise<User[] | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByName(name: string): Promise<User | undefined>;
  create(data: ICreateServiceDTO): Promise<User>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
