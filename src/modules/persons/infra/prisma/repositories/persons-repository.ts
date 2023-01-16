import ICreatePersonDTO from "@modules/persons/dtos/ICreatePersonDTO";
import IPersonRepository from "@modules/persons/repositories/IPersonRepository";
import { prismaDb } from "@shared/infra/http/server";
import { Person } from "../../entities/Person";
import { PrismaPersonMapper } from "../mappers/prisma-person-mapper";

export default class PrismaPersonPricesRepository implements IPersonRepository {
  public async find(): Promise<Person[]> {
    const persons = await prismaDb.persons.findMany({
      include: {cars: true, sales: true}
    });

    const formattedPersons = persons.map(person => PrismaPersonMapper.toDomain(person));

    return formattedPersons;
  }

  public async findById(id: string): Promise<Person | undefined> {
    const person = await prismaDb.persons.findUnique({
      where: {
        id,
      },
      include: {cars: true}
    });

    if(!person) {
      return undefined;
    }

    const formattedPerson = PrismaPersonMapper.toDomain(person)

    return formattedPerson;
  }

  public async findByCpf(cpf: string): Promise<Person | undefined> {
    const person = await prismaDb.persons.findFirst({
      where: {
        cpf,
      },
      include: {cars: true}
    });

    if(!person) {
      return undefined;
    }

    const formattedPerson = PrismaPersonMapper.toDomain(person)

    return formattedPerson;
  }

  public async create(data: ICreatePersonDTO): Promise<Person> {
    const person = await prismaDb.persons.create({
      data,
      include: {cars: true}
    });

    const formattedPerson = PrismaPersonMapper.toDomain(person);

    return formattedPerson;
  }

  public async save(person: Person): Promise<Person> {
    const updatedPersonPrice = await prismaDb.persons.update({
      where: {
        id: person.id,
      },
      data: PrismaPersonMapper.toPrisma(person),
      include: {cars: true}
    });

    const formattedPerson = PrismaPersonMapper.toDomain(updatedPersonPrice);

    return formattedPerson;
  }

  public async delete(id: string): Promise<void> {
    prismaDb.persons.delete({where: {id}});
  }
}
