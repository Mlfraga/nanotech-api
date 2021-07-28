import { getRepository, Repository } from 'typeorm';

import ICreateCarDTO from '../../../dtos/ICreateCarDTO';
import ICarRepository from '../../../repositories/ICarRepository';
import Car from '../entities/Car';

class CarRepository implements ICarRepository {
  private ormRepository: Repository<Car>;

  constructor() {
    this.ormRepository = getRepository(Car);
  }

  public async find(): Promise<Car[] | undefined> {
    const car = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });

    return car;
  }

  public async findById(id: string): Promise<Car | undefined> {
    const car = await this.ormRepository.findOne(id);

    return car;
  }

  public async findByPlateAndPersonId(
    model: string,
    carPlate: string,
    person: string,
  ): Promise<Car | undefined> {
    const car = await this.ormRepository.findOne({
      where: {
        person_id: person,
        model,
        plate: carPlate,
      },
    });

    return car;
  }

  public async create(data: ICreateCarDTO): Promise<Car> {
    const car = this.ormRepository.create(data);

    await this.ormRepository.save(car);

    return car;
  }

  public async save(user: Car): Promise<Car> {
    return this.ormRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default CarRepository;
