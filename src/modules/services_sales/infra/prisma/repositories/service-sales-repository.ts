import { prismaDb } from "@shared/infra/http/server";
import ICreateServiceDTO from "@modules/services/dtos/ICreateServiceDTO";
import IServiceRepository from "@modules/services/repositories/IServiceRepository";
import { ServiceSalesMapper } from "../mappers/services-sales-mapper";
import { ServiceSale } from "../../entities/ServiceSale";
import ICreateServiceSaleDTO from "@modules/services_sales/dtos/ICreateServiceSaleDTO";
import IServiceSaleRepository from "@modules/services_sales/repositories/IServiceSaleRepository";

export default class PrismaServiceSalesRepository implements IServiceSaleRepository {
  async find(): Promise<ServiceSale[] | undefined>{
    const services = await prismaDb.services_sales.findMany({
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
      }
    });

    return services.map(serviceSale => ServiceSalesMapper.toDomain(serviceSale));
  }

  async findById(id: string): Promise<ServiceSale | undefined>{
    const service = await prismaDb.services_sales.findUnique({
      where: {
        id: id,
      },
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
      }
    });

    return service ? ServiceSalesMapper.toDomain(service) : undefined;
  }

  async findBySale(id: string): Promise<ServiceSale[]>{
    const service = await prismaDb.services_sales.findMany({
      where: {
        sale_id: id,
      },
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
      }
    });

    return service.map(serviceSale => ServiceSalesMapper.toDomain(serviceSale));
  }

  async create(data: ICreateServiceSaleDTO): Promise<ServiceSale>{
    const serviceSale = await prismaDb.services_sales.create({
      data: ServiceSalesMapper.toPrisma(data),
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
      }
    });

    return ServiceSalesMapper.toDomain(serviceSale);
  }

  async save(serviceSale: ServiceSale): Promise<ServiceSale>{
    const updatedServiceSale = await prismaDb.services_sales.update({
      where: {
        id: serviceSale.id,
      },
      data: ServiceSalesMapper.toPrisma(serviceSale),
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
      }
    });

    return ServiceSalesMapper.toDomain(updatedServiceSale);
  }

  async delete(id: string): Promise<void>{
    await prismaDb.services_sales.delete({
      where: {
        id: id,
      },
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
      }
    });
  }

  async filter(
    serviceId: string,
    companyId: string,
    unitId: string,
    startDeliveryDate: Date,
    endDeliveryDate: Date,
  ): Promise<ServiceSale[]>{
    const service = await prismaDb.services_sales.findMany({
      orderBy: { created_at: 'asc'},
      where: {
        service_id: serviceId,
        sale: {
          delivery_date: {
            lte: endDeliveryDate,
            gte: startDeliveryDate
          },
          profiles: {
            company_id: companyId,
            unit_id: unitId,
          },
        },
      },
      include: {
        service: {
          include: {
            service_group: true,
          },
        },
        sale: {
          include: {
            profiles: true,
          },
        },
      }
    });

    const formattedServiceSales = service.map(serviceSale => ServiceSalesMapper.toDomain(serviceSale));

    return formattedServiceSales;
  }
}
