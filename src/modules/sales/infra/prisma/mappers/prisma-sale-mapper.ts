import { Car } from '@modules/cars/infra/entities/Car';
import { Company } from '@modules/companies/infra/entities/Company';
import { Person } from '@modules/persons/infra/entities/Person';
import { Profile } from '@modules/profiles/infra/entities/Profile';
import ICreateSaleDTO from '@modules/sales/dtos/ICreateSaleDTO';
import { Service } from '@modules/services/infra/entities/Service';
import { ServiceSale } from '@modules/services_sales/infra/entities/ServiceSale';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { User } from '@modules/users/infra/entities/User';
import { Prisma } from '@prisma/client';
import { Sale } from '../../entities/Sale';

export type PrismaSale = Prisma.salesGetPayload<{
  include: {
    profiles: {
      include: {
        companies: true,
        users: true,
      }
    },
    unities: true,
    persons: true,
    cars: true,
    services_sales: {
      include: {
        service: {
          include: {
            companies: true,
          }
        },
      },
    }
  };
}>;

export class PrismaSaleMapper {
  static toPrisma(sale: ICreateSaleDTO) {
    return {
      availability_date: sale.availability_date,
      delivery_date: sale.delivery_date,
      request_date: sale.request_date,
      company_value: sale.company_value,
      cost_value: sale.cost_value,
      source: sale.source,
      comments: sale.comments,
      seller_id: sale.seller_id,
      unit_id: sale.unit_id,
      person_id: sale.person_id,
      car_id: sale.car_id,
      status: sale.status,
      production_status: sale.production_status,
    };
  }

  static toDomain(raw: PrismaSale) {
    const customer = new Person({
      name: raw.persons.name,
      cpf: raw.persons.cpf,
      cars: [],
    }, raw.persons.id);

    return new Sale(
      {
        availability_date: raw.availability_date,
        delivery_date: raw.delivery_date,
        request_date: raw.request_date,
        company_value: Number(raw.company_value),
        cost_value: Number(raw.cost_value),
        source: raw.source,
        person_id: raw.person_id,
        person: customer,
        car_id: raw.car_id,
        partner_external_id: raw.partner_external_id,
        comments: raw.comments,
        client_identifier: String(raw.client_identifier),
        seller_id: raw.seller_id,
        car: new Car({
          brand: raw.cars.brand,
          model: raw.cars.model,
          color: raw.cars.color,
          person_id: raw.cars.person_id,
          plate: raw.cars.plate,
          created_at: raw.cars.created_at,
          updated_at: raw.cars.updated_at,
          person: customer,
        }, raw.cars.id),
        seller: new Profile({
          name: raw.profiles.name,
          user_id: raw.profiles.user_id,
          user: new User({
            enabled: raw.profiles.users.enabled,
            first_login: raw.profiles.users.first_login,
            password: raw.profiles.users.password,
            role: raw.profiles.users.role,
            username: raw.profiles.users.username,
            created_at: raw.profiles.users.created_at,
            updated_at: raw.profiles.users.updated_at,
            telephone: raw.profiles.users.telephone,
          }, raw.profiles.users.id),
          company_id: raw.profiles.company_id ?? undefined,
          ...(raw.profiles.companies && {company: new Company({
            name: raw.profiles.companies.name,
            cnpj: raw.profiles.companies.cnpj,
            client_identifier: raw.profiles.companies.client_identifier,
            unities: [],
            created_at: raw.profiles.companies.created_at,
            updated_at: raw.profiles.companies.updated_at,
            telephone: raw.profiles.companies.telephone,
          }, raw.profiles.companies.id)}),
          created_at: raw.profiles.created_at,
          unit_id: raw.profiles.unit_id ?? undefined,
          updated_at: raw.profiles.updated_at,
        }, raw.profiles.id),
        unit_id: raw.unit_id,
        unit: new Unit({
          name: raw.unities.name,
          company_id: raw.unities.company_id,
          created_at: raw.unities.created_at,
          updated_at: raw.unities.updated_at,
          client_identifier: raw.unities.client_identifier,
          telephone: raw.unities.telephone,
        }, raw.unities.id),
        service_providers: [],
        services_sales: raw.services_sales.map(service => new ServiceSale({
          service_id: service.service_id,
          service: new Service({
            name: service.service.name,
            company_id: service.service.company_id,
            company_price: Number(service.service.company_price),
            enabled: service.service.enabled,
            price: Number(service.service.price),
            company: service.service.companies ? new Company({
              name: service.service.companies?.name ?? "",
              cnpj: service.service.companies?.cnpj ?? "",
              client_identifier: service.service.companies?.client_identifier ?? "",
              unities: [],
              created_at: service.service.companies?.created_at,
              telephone: service.service.companies?.telephone ?? "",
              updated_at: service.service.companies?.updated_at,
            }, service.service.companies?.id) : null,
          }, service.service.id),
          company_value: Number(service.company_value),
          cost_value: Number(service.cost_value),
          sale_id: service.sale_id,
          created_at: service.created_at,
          updated_at: service.updated_at,
        })),
        status: raw.status,
        production_status: raw.production_status ?? 'TO_DO',
        created_at: raw.created_at,
        updated_at: raw.updated_at,
        techinical_comments: raw.techinical_comments,
        finished_at: raw.finished_at ?? undefined,
      },
      raw.id,
    );
  }
}
