import ICreateCarDTO from "@modules/cars/dtos/ICreateCarDTO";
import ICarRepository from "@modules/cars/repositories/ICarRepository";
import { prismaDb } from "@shared/infra/http/server";
import { Car } from "../../entities/Car";
import { PrismaCarMapper } from "../mappers/prisma-car-mapper";

export default class PrismaCarsRepository implements ICarRepository {
  public async find(): Promise<Car[] | undefined> {
    const cars = await prismaDb.cars.findMany();

    const formattedCars = cars.map(car => PrismaCarMapper.toDomain(car));

    return formattedCars;
  }

  public async findById(id: string): Promise<Car | undefined> {
    const car = await prismaDb.cars.findUnique({
      where: {
        id,
      },
    });

    if(!car) {
      return undefined;
    }

    const formattedCar = PrismaCarMapper.toDomain(car)

    return formattedCar;
  }

  public async findByPlateAndPersonId(
    model: string,
    carPlate: string,
    person: string,
  ): Promise<Car | undefined> {
    const car = await prismaDb.cars.findFirst({
      where: {
        person_id: person,
        model,
        plate: carPlate,
      },
    });

    if(!car) {
      return undefined;
    }

    const formattedCar = PrismaCarMapper.toDomain(car)

    return formattedCar;
  }

  public async create(data: ICreateCarDTO): Promise<Car> {
    const car = await prismaDb.cars.create({
      data
    });

    const formattedCar = PrismaCarMapper.toDomain(car);

    return formattedCar;
  }

  public async save(car: Car): Promise<Car> {
    const updatedCar = await prismaDb.cars.update({
      where: {
        id: car.id,
      },
      data: {
        model: car.model,
        plate: car.plate,
        color: car.color,
        brand: car.brand,
        person_id: car.person_id,
        created_at: car.created_at,
        updated_at: car.updated_at,
      },
    });

    const formattedCar = PrismaCarMapper.toDomain(updatedCar);

    return formattedCar;
  }

  public async delete(id: string): Promise<void> {
    prismaDb.cars.delete({where: {id}});
  }
}
