import { Prisma } from '@prisma/client';
import { Unit } from '../../entities/Unit';
import ICreateUnitDTO from '@modules/unities/dtos/ICreateUnitDTO';

export type PrismaUnitiesProvider = Prisma.unitiesGetPayload<{}>;

export class UnitiesMapper {
  static toPrisma(data: ICreateUnitDTO) {
    return {
      name: data.name,
      telephone: data.telephone,
      client_identifier: data.client_identifier,
      company_id: data.company_id
    };
  }

  static toDomain(raw: PrismaUnitiesProvider) {
    return new Unit(
      {
        client_identifier: raw.client_identifier,
        company_id: raw.company_id,
        name: raw.name,
        telephone: raw.telephone,
      }, raw.id
    );
  }
}
