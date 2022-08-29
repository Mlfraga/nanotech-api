import { container } from 'tsyringe';

import './providers';
import '@modules/users/providers';

import WhatsappNumberRepository from '@modules/whatsapp_numbers/infra/typeorm/repositories/WhatsappNumberRepository';
import IWhatsappNumberRepository from '@modules/whatsapp_numbers/repositories/IWhatsappNumberRepository';

import CarRepository from '../../modules/cars/infra/typeorm/repositories/CarRepository';
import ICarRepository from '../../modules/cars/repositories/ICarRepository';
import CompanyRepository from '../../modules/companies/infra/typeorm/repositories/CompanyRepository';
import ICompanyRepository from '../../modules/companies/repositories/ICompanyRepository';
import CompanyPricesRepository from '../../modules/company_prices/infra/typeorm/repositories/CompanyPricesRepository';
import ICompanyPricesRepository from '../../modules/company_prices/repositories/ICompanyPricesRepository';
import PersonRepository from '../../modules/persons/infra/typeorm/repositories/PersonRepository';
import IPersonRepository from '../../modules/persons/repositories/IPersonRepository';
import ProfileRepository from '../../modules/profiles/infra/typeorm/repositories/ProfileRepository';
import IProfileRepository from '../../modules/profiles/repositories/IProfileRepository';
import SaleRepository from '../../modules/sales/infra/typeorm/repositories/SaleRepository';
import ISaleRepository from '../../modules/sales/repositories/ISaleRepository';
import ServiceSaleRepository from '../../modules/services_sales/infra/typeorm/repositories/ServiceSaleRepository';
import IServiceSaleRepository from '../../modules/services_sales/repositories/IServiceSaleRepository';
import ServiceRepository from '../../modules/services/infra/typeorm/repositories/ServiceRepository';
import IServiceRepository from '../../modules/services/repositories/IServiceRepository';
import UnitRepository from '../../modules/unities/infra/typeorm/repositories/UnitRepository';
import IUnitRepository from '../../modules/unities/repositories/IUnitRepository';
import UserRepository from '../../modules/users/infra/typeorm/repositories/UserRepository';
import IUsersRepository from '../../modules/users/repositories/IUsersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UserRepository,
);

container.registerSingleton<IPersonRepository>(
  'PersonRepository',
  PersonRepository,
);

container.registerSingleton<IServiceSaleRepository>(
  'ServiceSaleRepository',
  ServiceSaleRepository,
);

container.registerSingleton<ISaleRepository>('SaleRepository', SaleRepository);

container.registerSingleton<ICompanyPricesRepository>(
  'CompanyPricesRepository',
  CompanyPricesRepository,
);

container.registerSingleton<ICompanyRepository>(
  'CompanyRepository',
  CompanyRepository,
);

container.registerSingleton<IProfileRepository>(
  'ProfileRepository',
  ProfileRepository,
);

container.registerSingleton<ICarRepository>('CarRepository', CarRepository);

container.registerSingleton<IUnitRepository>('UnitRepository', UnitRepository);

container.registerSingleton<IServiceRepository>(
  'ServiceRepository',
  ServiceRepository,
);

container.registerSingleton<IWhatsappNumberRepository>(
  'WhatsappNumberRepository',
  WhatsappNumberRepository,
);
