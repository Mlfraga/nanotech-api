import { Company } from '@modules/companies/infra/entities/Company';
import ICreateProfileDTO from '@modules/profiles/dtos/ICreateProfileDTO';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { User } from '@modules/users/infra/entities/User';
import { Prisma } from '@prisma/client';
import { ServiceProvider } from '../../entities/ServiceProvider';
import ServiceProvider from '../../entities/ServiceProvider';
import { Sale } from '@modules/sales/infra/entities/Sale';

export type PrismaServiceProvider = Prisma.sales_service_providersGetPayload<{
  include: {
    profiles: true,
    sales: true,
  };
}>;

export class ServiceProviderMapper {
  static toPrisma(profile: ICreateProfileDTO) {
    return {
      company_id: profile.company_id,
      name: profile.name,
      unit_id: profile.unit_id,
      user_id: profile.user_id,
    };
  }

  static toDomain(raw: PrismaServiceProvider) {
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
        }),
      },
      raw.id,
    );
  }
}
