import ICreateCarDTO from '@modules/cars/dtos/ICreateCarDTO';
import { cars as RawCar } from '@prisma/client';
import { Car } from '../../entities/Car';

export class PrismaCarMapper {
  static toPrisma(car: ICreateCarDTO) {
    return {
      brand: car.brand,
      model: car.model,
      plate: car.plate,
      color: car.color,
      person_id: car.person_id,
    };
  }

  static toDomain(raw: RawCar) {
    return new Car(
      {
        brand: raw.brand,
        model: raw.model,
        plate: raw.plate,
        color: raw.color,
        person_id: raw.person_id,
      },
      raw.id,
    );
  }
}
