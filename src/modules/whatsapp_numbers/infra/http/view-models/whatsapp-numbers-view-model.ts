import { WhatsappNumber } from '../../entities/WhatsappNumber';

export class WhatsappNumbersViewModel {
  static toHttp(user: WhatsappNumber) {
    return {
      id: user.id,
      number: user.number,
      restricted_to_especific_company: user.restricted_to_especific_company,
      company_id: user.company_id,
      company: user.company,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
