import { getRepository, Repository } from 'typeorm';

import ICreatePersonDTO from '../../../dtos/ICreatePersonDTO';
import IPersonRepository from '../../../repositories/IPersonRepository';
import Person from '../entities/Person';

class PersonRepository implements IPersonRepository {
  private ormRepository: Repository<Person>;

  constructor() {
    this.ormRepository = getRepository(Person);
  }

  public async find(): Promise<Person[] | undefined> {
    const person = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });

    return person;
  }

  public async findById(id: string): Promise<Person | undefined> {
    const person = await this.ormRepository.findOne(id);

    return person;
  }

  public async findByCpf(cpf: string): Promise<Person | undefined> {
    const person = await this.ormRepository.findOne({ where: { cpf } });

    return person;
  }

  public async create(data: ICreatePersonDTO): Promise<Person> {
    const person = this.ormRepository.create(data);

    await this.ormRepository.save(person);

    return person;
  }

  public async save(person: Person): Promise<Person> {
    return this.ormRepository.save(person);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default PersonRepository;
