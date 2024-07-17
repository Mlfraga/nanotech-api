import ICreateProfileDTO from '@modules/profiles/dtos/ICreateProfileDTO';
import { Prisma } from '@prisma/client';
import { Sale } from '@modules/sales/infra/entities/Sale';
import { ServiceProvider } from '../../entities/ServiceProvider';
import { User } from '@modules/users/infra/entities/User';
import { Company } from '@modules/companies/infra/entities/Company';
import { Profile } from '@modules/profiles/infra/entities/Profile';
import ICreateServiceProviderDTO from '@modules/service_providers/dtos/ICreateServiceProviderDTO';
import { Person } from '@modules/persons/infra/entities/Person';
import { Car } from '@modules/cars/infra/entities/Car';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { Service } from '@modules/services/infra/entities/Service';
import { ServiceSale } from '@modules/services_sales/infra/entities/ServiceSale';

export type PrismaServiceProvider = Prisma.sales_service_providersGetPayload<{
  include: {
    profiles: {
      include: {
        users: true,
        companies: true,
      }
    },
    sales: {
      include: {
        persons: true,
        cars: true,
        profiles: true,
        sales_service_providers: true,
        unities: true,
        services_sales: {
          include: {
            service: true,
          }
        }
      }
    },
  };
}>;

export class ServiceProviderMapper {
  static toPrisma(data: ICreateServiceProviderDTO) {
    return {
      date_to_be_done: data.date_to_be_done,
      sale_id: data.sale_id,
      service_provider_profile_id: data.service_provider_profile_id,
    };
  }

  static toDomain(raw: PrismaServiceProvider) {
    const customer = new Person({
      name: raw.sales.persons.name,
      cpf: raw.sales.persons.cpf,
      cars: [],
    }, raw.sales.persons.id);

    return new ServiceProvider(
      {
        sale_id: raw.sale_id,
        service_provider_profile_id: raw.service_provider_profile_id,
        date_to_be_done: raw.date_to_be_done,
        sale: new Sale({
          comments: raw.sales.comments,
          availability_date: raw.sales.availability_date,
          car_id: raw.sales.car_id,
          client_identifier: String(raw.sales.client_identifier),
          company_value: Number(raw.sales.company_value),
          cost_value: Number(raw.sales.cost_value),
          delivery_date: raw.sales.delivery_date,
          person_id: raw.sales.person_id,
          production_status: raw.sales.production_status || '',
          request_date: raw.sales.request_date,
          seller_id: raw.sales.seller_id,
          source: raw.sales.source,
          status: raw.sales.status,
          techinical_comments: raw.sales.techinical_comments,
          unit_id: raw.sales.unit_id,
          created_at: raw.sales.created_at,
          updated_at: raw.sales.updated_at,
          finished_at: raw.sales.finished_at || undefined,
          services_sales: raw.sales.services_sales.map(serviceSale => new ServiceSale({
            company_value: Number(serviceSale.company_value),
            cost_value: Number(serviceSale.cost_value),
            sale_id: serviceSale.sale_id,
            service_id: serviceSale.service_id,
            service: new Service({
              name: serviceSale.service.name,
              price: Number(serviceSale.service.price),
              enabled: serviceSale.service.enabled,
              company_price: Number(serviceSale.service.company_price),
              commission_amount: Number(serviceSale.service.commission_amount),
              company_id: serviceSale.service.company_id || undefined,
              service_group_id: serviceSale.service.service_group_id || undefined,
              created_at: serviceSale.service.created_at,
              updated_at: serviceSale.service.updated_at,
            }, serviceSale.service_id),
          }, serviceSale.id)),
          service_providers: [],
          partner_external_id: raw.sales.partner_external_id,
          person: customer,
          car: new Car({
            brand: raw.sales.cars.brand,
            model: raw.sales.cars.model,
            color: raw.sales.cars.color,
            person_id: raw.sales.cars.person_id,
            plate: raw.sales.cars.plate,
            created_at: raw.sales.cars.created_at,
            updated_at: raw.sales.cars.updated_at,
            person: customer,
          }, raw.sales.cars.id),
          seller: new Profile({
            name: raw.profiles.name,
            user_id: raw.profiles.user_id,
            user: new User({
              enabled: raw.profiles.users.enabled,
              first_login: raw.profiles.users.first_login,
              password: raw.profiles.users.password,
              role: raw.profiles.users.role,
              email: raw.profiles.users.email,
              pix_key: raw.profiles.users.pix_key ?? undefined,
              pix_key_type: raw.profiles.users.pix_key_type ?? undefined,
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
          unit: new Unit({
            name: raw.sales.unities.name,
            company_id: raw.sales.unities.company_id,
            created_at: raw.sales.unities.created_at,
            updated_at: raw.sales.unities.updated_at,
            client_identifier: raw.sales.unities.client_identifier,
            telephone: raw.sales.unities.telephone,
          }, raw.sales.unities.id),
        }, raw.sales.id),
        provider: new Profile({
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
            email: raw.profiles.users.email,
            pix_key: raw.profiles.users.pix_key ?? undefined,
            pix_key_type: raw.profiles.users.pix_key_type ?? undefined,
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
        }, raw.profiles.id)
      },
      raw.id,
    );
  }
}
