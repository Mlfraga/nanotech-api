import ICreateWhatsappNumberDTO from "@modules/whatsapp_numbers/dtos/ICreateWhatsappNumberDTO";
import IWhatsappNumberRepository from "@modules/whatsapp_numbers/repositories/IWhatsappNumberRepository";
import { prismaDb } from "@shared/infra/http/server";
import { WhatsappNumber } from "../../entities/WhatsappNumber";
import { PrismaWhatsappNumberMapper } from "../mappers/prisma-whatsapp-number-mapper";

export default class PrismaWhatsappNumbersRepository implements IWhatsappNumberRepository {
  deleteAll(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async find(): Promise<WhatsappNumber[] | undefined> {
    const whatsappNumbers = await prismaDb.whatsapp_numbers.findMany();

    const formattedWhatsappNumbers = whatsappNumbers.map(whatsappNumber => PrismaWhatsappNumberMapper.toDomain(whatsappNumber));

    return formattedWhatsappNumbers;
  }

  async findById(id: string): Promise<WhatsappNumber | undefined> {
    const whatsappNumber = await prismaDb.whatsapp_numbers.findUnique({
      where: {
        id,
      },
    });

    if (!whatsappNumber) {
      return undefined;
    }

    const formattedWhatsappNumber = PrismaWhatsappNumberMapper.toDomain(whatsappNumber);

    return formattedWhatsappNumber;
  }

  async findByNumber(number: string): Promise<WhatsappNumber | undefined> {
    const whatsappNumber = await prismaDb.whatsapp_numbers.findUnique({
      where: {
        number,
      },
    });

    if (!whatsappNumber) {
      return undefined;
    }

    const formattedWhatsappNumber = PrismaWhatsappNumberMapper.toDomain(whatsappNumber);

    return formattedWhatsappNumber;

  }

  async findByCompany(company_id: string): Promise<WhatsappNumber[]> {
    const whatsappNumbers = await prismaDb.whatsapp_numbers.findMany({
      where: {
        company_id,
      },
    });

    const formattedWhatsappNumbers = whatsappNumbers.map(whatsappNumber => PrismaWhatsappNumberMapper.toDomain(whatsappNumber));

    return formattedWhatsappNumbers;
  }

  async findAllGlobalNumbers(): Promise<WhatsappNumber[]> {
    const whatsappNumbers = await prismaDb.whatsapp_numbers.findMany({
      where: {
        restricted_to_especific_company: false
      },
    });

    const formattedWhatsappNumbers = whatsappNumbers.map(whatsappNumber => PrismaWhatsappNumberMapper.toDomain(whatsappNumber));

    return formattedWhatsappNumbers;

  }

  public async create(data: ICreateWhatsappNumberDTO): Promise<WhatsappNumber> {
    const whatsapp_number = await prismaDb.whatsapp_numbers.create({
      data,
    });

    const formattedWhatsappNumber = PrismaWhatsappNumberMapper.toDomain(whatsapp_number);

    return formattedWhatsappNumber;
  }

  public async save(whatsapp_number: WhatsappNumber): Promise<WhatsappNumber> {
    const updatedWhatsappNumber = await prismaDb.whatsapp_numbers.update({
      where: {
        id: whatsapp_number.id,
      },
      data: PrismaWhatsappNumberMapper.toPrisma(whatsapp_number),
    });

    const formattedWhatsappNumber = PrismaWhatsappNumberMapper.toDomain(updatedWhatsappNumber);

    return formattedWhatsappNumber;
  }

  public async delete(id: string): Promise<void> {
    prismaDb.whatsapp_numbers.delete({where: {id}});
  }
}
