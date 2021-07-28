import ICreatePersonDTO from '../dtos/ICreatePersonDTO';
import Person from '../infra/typeorm/entities/Person';

export default interface IPersonRepository {
  find(): Promise<Person[] | undefined>;
  findById(id: string): Promise<Person | undefined>;
  findByCpf(cpf: string): Promise<Person | undefined>;
  create(data: ICreatePersonDTO): Promise<Person>;
  save(person: Person): Promise<Person>;
  delete(id: string): Promise<void>;
}
