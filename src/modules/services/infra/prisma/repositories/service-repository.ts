import { prismaDb } from "@shared/infra/http/server";
import { Service } from "../../entities/Service";
import ICreateServiceDTO from "@modules/services/dtos/ICreateServiceDTO";
import IServiceRepository from "@modules/services/repositories/IServiceRepository";
import { ServiceMapper } from "../mappers/service-mapper";

export default class PrismaServiceRepository implements IServiceRepository {

  async find(): Promise<Service[] | undefined> {
    const services = await prismaDb.services.findMany({
      orderBy: { created_at: 'asc' },
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    const formattedServices = services.map(service => ServiceMapper.toDomain(service));

    return formattedServices;
  }

  async findById(id: string): Promise<Service | undefined> {
    const service = await prismaDb.services.findUnique({
      where: { id },
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    if (!service) {
      return undefined;
    }

    return ServiceMapper.toDomain(service);
  }

  async findByCompanyIdAndServiceGroup(companyId: string, serviceGroupId: string): Promise<Service | undefined> {
    const service = await prismaDb.services.findFirst({
      where: { company_id: companyId, service_group_id: serviceGroupId },
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    if (!service) {
      return undefined;
    }

    return ServiceMapper.toDomain(service);
  }

  async findByCompanyId(companyId: string, showDisabled: boolean): Promise<Service[]> {
    const services = await prismaDb.services.findMany({
      where: { company_id: companyId, ...(showDisabled ? {} : { enabled: true }) },
      orderBy: { name: 'asc' },
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    const formattedServices = services.map(service => ServiceMapper.toDomain(service));

    return formattedServices;
  }

  async findByName(name: string): Promise<Service | undefined> {
    const service = await prismaDb.services.findFirst({
      where: { name },
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    if (!service) {
      return undefined;
    }

    return ServiceMapper.toDomain(service);
  }

  async create(data: Service): Promise<Service> {
    const service = await prismaDb.services.create({
      data: ServiceMapper.toPrisma(data),
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    return ServiceMapper.toDomain(service);
  }

  async save(service: Service): Promise<Service> {
    const updatedService = await prismaDb.services.update({
      where: { id: service.id },
      data: ServiceMapper.toPrisma(service),
      include: {
        companies: {
          include: {
            company_prices: true,
          }
        },
        service_group: true,
      }
    });

    return ServiceMapper.toDomain(updatedService);
  }

  async delete(id: string): Promise<void> {
    await prismaDb.services.delete({
      where: {
        id,
      }
    });
  }
}
