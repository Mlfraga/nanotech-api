import ICreateCarDTO from '../dtos/ICreateCarDTO';
import Car from '../infra/typeorm/entities/Car';

export default interface ICarRepository {
  find(): Promise<Car[] | undefined>;
  findById(id: string): Promise<Car | undefined>;
  findByPlateAndPersonId(
    model: string,
    carPlate: string,
    person: string,
  ): Promise<Car | undefined>;
  create(data: ICreateCarDTO): Promise<Car>;
  save(car: Car): Promise<Car>;
  delete(id: string): Promise<void>;
}
