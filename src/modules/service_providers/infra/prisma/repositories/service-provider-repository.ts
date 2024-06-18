import IServiceProviderRepository from "@modules/service_providers/repositories/IServiceProviderRepository";
import { prismaDb } from "@shared/infra/http/server";
import { ServiceProvider } from "../../entities/ServiceProvider";
import { ServiceProviderMapper } from "../mappers/service-provider-mapper";
import { addDays, endOfDay, startOfDay } from "date-fns";
import ICreateServiceProviderDTO from "@modules/service_providers/dtos/ICreateServiceProviderDTO";


export default class PrismaServiceProviderRepository implements IServiceProviderRepository {
  public async find(): Promise<ServiceProvider[] | undefined>{
    const saleServiceProviders = await prismaDb.sales_service_providers.findMany({
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    const formattedServiceProviders = saleServiceProviders.map(saleServiceProvider => ServiceProviderMapper.toDomain(saleServiceProvider));

    return formattedServiceProviders;
  }
  public async findById(id: string): Promise<ServiceProvider | undefined>{
    const serviceProvider = await prismaDb.sales_service_providers.findUnique({
      where: {
        id,
      },
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    if(!serviceProvider) {
      return undefined;
    }

    return ServiceProviderMapper.toDomain(serviceProvider);
  }
  public async findBySale(sale_id: string): Promise<ServiceProvider[]>{
    const serviceProviders = await prismaDb.sales_service_providers.findMany({
      where: {
        sale_id,
      },
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    const formattedServiceProviders = serviceProviders.map(serviceProvider => ServiceProviderMapper.toDomain(serviceProvider));

    return formattedServiceProviders;
  }
  public async findByProviderId(provider_id: string, listFrom?: 'yesterday' | 'today' | 'tomorrow',): Promise<ServiceProvider[]>{
    let dateFilterCriterias = {
      today: {
        lte: new Date(endOfDay(new Date())),
        gte: new Date(startOfDay(new Date())),
      },
      yesterday: {
        lte: new Date(addDays(endOfDay(new Date()), -1),),
        gte: new Date(addDays(startOfDay(new Date()), -1),),
      },
      tomorrow: {
        lte: new Date(addDays(endOfDay(new Date()), 1),),
        gte: new Date(addDays(startOfDay(new Date()), 1),),
      },
    };

    console.log('where: ', {
        service_provider_profile_id: provider_id,
        date_to_be_done: dateFilterCriterias[listFrom || 'today']
      })

    const serviceProviders = await prismaDb.sales_service_providers.findMany({
      where: {
        service_provider_profile_id: provider_id,
        date_to_be_done: dateFilterCriterias[listFrom || 'today']
      },
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    const formattedServiceProviders = serviceProviders.map(serviceProvider => ServiceProviderMapper.toDomain(serviceProvider));

    return formattedServiceProviders;

  }
  public async findByProviderAndSaleId(provider_id: string, sale_id: string,): Promise<ServiceProvider | undefined>{
    const serviceProvider = await prismaDb.sales_service_providers.findFirst({
      where: {
        service_provider_profile_id: provider_id,
        sale_id,
      },
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    if(!serviceProvider) {
      return undefined;
    }

    return ServiceProviderMapper.toDomain(serviceProvider);

  }
  public async create(data: ICreateServiceProviderDTO): Promise<ServiceProvider>{
    const serviceProvider = await prismaDb.sales_service_providers.create({
      data: ServiceProviderMapper.toPrisma(data),
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    return ServiceProviderMapper.toDomain(serviceProvider);
  }

  public async save(saleServiceProvider: ServiceProvider): Promise<ServiceProvider>{
    const serviceProvider = await prismaDb.sales_service_providers.update({
      where: {
        id: saleServiceProvider.id,
      },
      data: ServiceProviderMapper.toPrisma(saleServiceProvider),
      include: {
        profiles: {
          include: {
            users: true,
            companies: true,
          }
        },
        sales: {
          include: {
            services_sales: {
              include: {
                service: true,
              }
            },
            persons: true,
            cars: true,
            profiles: true,
            sales_service_providers: true,
            unities: true,
          }
        },
      }
    });

    return ServiceProviderMapper.toDomain(serviceProvider);

  }
  public async delete(id: string): Promise<void>{
    await prismaDb.sales_service_providers.delete({
      where: {
        id,
      }
    });
  }
  public async deleteBySale(sale_id: string): Promise<void>{
    await prismaDb.sales_service_providers.deleteMany({
      where: {
        sale_id,
      }
    });
  }
}
