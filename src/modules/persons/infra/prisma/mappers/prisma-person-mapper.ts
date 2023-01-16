import { Car } from '@modules/cars/infra/entities/Car';
import { Company } from '@modules/companies/infra/entities/Company';
import ICreatePersonDTO from '@modules/persons/dtos/ICreatePersonDTO';
import { Service } from '@modules/services/infra/entities/Service';
import { Prisma } from '@prisma/client';
import { Person } from '../../entities/Person';

export type PrismaPerson = Prisma.personsGetPayload<{
  include: {
    cars: true;
  };
}>;

export class PrismaPersonMapper {
  static toPrisma(person: ICreatePersonDTO) {
    return {
      cpf: person.cpf,
      name: person.name,
    };
  }

  static toDomain(raw: PrismaPerson) {
    return new Person(
      {
        cpf: raw.cpf,
        name: raw.name,
        cars: raw.cars.map(car => new Car({
          model: car.model,
          brand: car.brand,
          plate: car.plate,
          color: car.color,
          person_id: car.person_id,
          created_at: car.created_at,
          updated_at: car.updated_at,
        })),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      raw.id,
    );
  }
}
