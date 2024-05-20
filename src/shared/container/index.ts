import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IServiceProviderRepository from '@modules/service_providers/repositories/IServiceProviderRepository';
import IWhatsappNumberRepository from '@modules/whatsapp_numbers/repositories/IWhatsappNumberRepository';

import ICarRepository from '../../modules/cars/repositories/ICarRepository';
import ICommissionerRepository from '../../modules/_legacy_commissioners/repositories/ICommissionerRepository';
import ICompanyRepository from '../../modules/companies/repositories/ICompanyRepository';
import CompanyPricesRepository from '../../modules/company_prices/infra/prisma/repositories/company-prices-repository';
import ICompanyPricesRepository from '../../modules/company_prices/repositories/ICompanyPricesRepository';
import PersonRepository from '../../modules/persons/infra/prisma/repositories/persons-repository';
import IPersonRepository from '../../modules/persons/repositories/IPersonRepository';
import ProfileRepository from '../../modules/profiles/infra/prisma/repositories/profiles-repository';
import IProfileRepository from '../../modules/profiles/repositories/IProfileRepository';
import PrismaCarsRepository from '@modules/cars/infra/prisma/repositories/cars-repository';
import PrismaCompaniesRepository from '@modules/companies/infra/prisma/repositories/companies-repository';
import SaleRepository from '../../modules/sales/infra/prisma/repositories/sales-repository';
import ISaleRepository from '../../modules/sales/repositories/ISaleRepository';
import IServiceRepository from '../../modules/services/repositories/IServiceRepository';
import IServiceSaleRepository from '../../modules/services_sales/repositories/IServiceSaleRepository';
import IUnitRepository from '../../modules/unities/repositories/IUnitRepository';
import IUsersRepository from '../../modules/users/repositories/IUsersRepository';
import PrismaUsersRepository from '@modules/users/infra/prisma/repositories/users-repository';
import PrismaServiceSalesRepository from '@modules/services_sales/infra/prisma/repositories/service-sales-repository';
import PrismaUnitRepository from '@modules/unities/infra/prisma/repositories/unities-repository';
import PrismaServiceRepository from '@modules/services/infra/prisma/repositories/service-provider-repository';
import PrismaWhatsappNumbersRepository from '@modules/whatsapp_numbers/infra/prisma/repositories/whatsapp-numbers-repository';
import PrismaServiceProviderRepository from '@modules/service_providers/infra/prisma/repositories/service-provider-repository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  PrismaUsersRepository,
);

container.registerSingleton<IPersonRepository>(
  'PersonRepository',
  PersonRepository,
);

container.registerSingleton<IServiceSaleRepository>(
  'ServiceSaleRepository',
  PrismaServiceSalesRepository,
);

container.registerSingleton<ISaleRepository>('SaleRepository', SaleRepository);

container.registerSingleton<ICompanyPricesRepository>(
  'CompanyPricesRepository',
  CompanyPricesRepository,
);

container.registerSingleton<ICompanyRepository>(
  'CompanyRepository',
  PrismaCompaniesRepository,
);

container.registerSingleton<IProfileRepository>(
  'ProfileRepository',
  ProfileRepository,
);

container.registerSingleton<ICarRepository>('CarRepository', PrismaCarsRepository);

container.registerSingleton<IUnitRepository>('UnitRepository', PrismaUnitRepository);

container.registerSingleton<IServiceRepository>(
  'ServiceRepository',
  PrismaServiceRepository,
);

container.registerSingleton<IWhatsappNumberRepository>(
  'WhatsappNumberRepository',
  PrismaWhatsappNumbersRepository,
);

container.registerSingleton<IServiceProviderRepository>(
  'ServiceProviderRepository',
  PrismaServiceProviderRepository,
);
