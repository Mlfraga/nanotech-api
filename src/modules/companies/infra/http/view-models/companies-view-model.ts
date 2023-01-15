import { Company } from "../../entities/Company";

export class CompaniesViewModel {
  static toHttp(company: Company){
    return {
      id: company.id,
      name: company.name,
      cnpj: company.cnpj,
      telephone: company.telephone,
      unities: company.unities.map(unit => {
        return {
          id: unit.id,
          name: unit.name,
          client_identifier: unit.client_identifier,
          telephone: unit.telephone,
        }
      }),
      client_identifier: company.client_identifier,
    }
  }
}
