import ICreateCarDTO from "@modules/cars/dtos/ICreateCarDTO";
import ICarRepository from "@modules/cars/repositories/ICarRepository";
import { PrismaClient } from '@prisma/client'
import { Car } from "../../entities/Car";
import { PrismaCarMapper } from "../mappers/prisma-car-mapper";

export default class PrismaCarsRepository implements ICarRepository {
  public async find(): Promise<Car[] | undefined> {
    const prisma = new PrismaClient()

    const cars = await prisma.cars.findMany();

    const formattedCars = cars.map(car => PrismaCarMapper.toDomain(car));

    return formattedCars;
  }

  public async findById(id: string): Promise<Car | undefined> {
    const prisma = new PrismaClient()

    const car = await prisma.cars.findUnique({
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
    const prisma = new PrismaClient()

    const car = await prisma.cars.findFirst({
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
    const prisma = new PrismaClient()

    const car = await prisma.cars.create({
      data
    });

    const formattedCar = PrismaCarMapper.toDomain(car);

    return formattedCar;
  }

  public async save(car: Car): Promise<Car> {
    const prisma = new PrismaClient()

    const updatedCar = await prisma.cars.update({
      where: {
        id: car.id,
      },
      data: car,
    });

    const formattedCar = PrismaCarMapper.toDomain(updatedCar);

    return formattedCar;
  }

  public async delete(id: string): Promise<void> {
    const prisma = new PrismaClient()

    prisma.cars.delete({where: {id}});
  }
}
