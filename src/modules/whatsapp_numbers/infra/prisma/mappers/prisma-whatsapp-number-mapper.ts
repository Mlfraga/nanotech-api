
import { Prisma } from '@prisma/client';
import { WhatsappNumber } from '../../entities/WhatsappNumber';
import ICreateWhatsappNumberDTO from '@modules/whatsapp_numbers/dtos/ICreateWhatsappNumberDTO';

export type PrismaUnitiesProvider = Prisma.whatsapp_numbersGetPayload<{}>;

export class PrismaWhatsappNumberMapper {
  static toPrisma(user: ICreateWhatsappNumberDTO) {
    return {
      number: user.number,
      restricted_to_especific_company: user.restricted_to_especific_company,
      company_id: user.company_id,
    };
  }

  static toDomain(raw: PrismaUnitiesProvider) {
    return new WhatsappNumber({
      number: raw.number,
      restricted_to_especific_company: raw.restricted_to_especific_company,
      company_id: raw.company_id ?? undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    }, raw.id);
  }
}
