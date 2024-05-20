import { prismaDb } from "@shared/infra/http/server";
import { UnitiesMapper } from "../mappers/unities-mapper";
import { Unit } from "../../entities/Unit";
import IUnitRepository from "@modules/unities/repositories/IUnitRepository";
import ICreateUnitDTO from "@modules/unities/dtos/ICreateUnitDTO";

export default class PrismaUnitRepository implements IUnitRepository {
  async find(): Promise<Unit[] | undefined> {
    const unities = await prismaDb.unities.findMany({
      orderBy: {
        created_at: 'asc'
      }
    });

    const formattedUnities = unities.map((unity) => UnitiesMapper.toDomain(unity));

    return formattedUnities;
  }

  async findById(id: string): Promise<Unit | undefined> {
    const unity = await prismaDb.unities.findUnique({
      where: {
        id
      }
    });

    if (!unity) {
      return undefined;
    }

    return UnitiesMapper.toDomain(unity);
  }

  async findByCompanyId(company_id: string): Promise<Unit[] | undefined> {
    const unities = await prismaDb.unities.findMany({
      where: {
        company_id
      }
    });

    const formattedUnities = unities.map((unity) => UnitiesMapper.toDomain(unity));

    return formattedUnities;
  }

  async findByNameAndCompany(companyId: string, name: string): Promise<Unit[] | undefined> {
    const unities = await prismaDb.unities.findMany({
      where: {
        company_id: companyId,
        name
      }
    });

    const formattedUnities = unities.map((unity) => UnitiesMapper.toDomain(unity));

    return formattedUnities;
  }

  async create(data: ICreateUnitDTO): Promise<Unit> {
    const unity = await prismaDb.unities.create({
      data: UnitiesMapper.toPrisma(data)
    });

    return UnitiesMapper.toDomain(unity);
  }

  async save(unit: Unit): Promise<Unit> {
    const unity = await prismaDb.unities.update({
      where: {
        id: unit.id
      },
      data: UnitiesMapper.toPrisma(unit)
    });

    return UnitiesMapper.toDomain(unity);
  }

  async delete(id: string): Promise<void> {
    await prismaDb.unities.delete({
      where: {
        id
      }
    });
  }
}
