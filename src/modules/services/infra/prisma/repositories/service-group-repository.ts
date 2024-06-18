import { prismaDb } from "@shared/infra/http/server";
import { ServiceGroup } from "../../entities/ServiceGroup";
import ICreateServiceGroupDTO from "@modules/services/dtos/ICreateServiceGroupDTO";
import IServiceGroupRepository from "@modules/services/repositories/IServiceGroupRepository";
import { ServiceGroupMapper } from "../mappers/service-group-mapper";

export default class PrismaServiceGroupRepository implements IServiceGroupRepository {

  async find(): Promise<ServiceGroup[]> {
    const serviceGroups = await prismaDb.service_group.findMany({
      orderBy: { created_at: 'asc' },
    });

    const formattedServiceGroups = serviceGroups.map(serviceGroup => ServiceGroupMapper.toDomain(serviceGroup));

    return formattedServiceGroups;
  }

  async findById(id: string): Promise<ServiceGroup | undefined> {
    const serviceGroup = await prismaDb.service_group.findUnique({
      where: { id },
    });

    if (!serviceGroup) {
      return undefined;
    }

    return ServiceGroupMapper.toDomain(serviceGroup);
  }

  async create(data: ICreateServiceGroupDTO): Promise<ServiceGroup> {
    const serviceGroup = await prismaDb.service_group.create({
      data: ServiceGroupMapper.toPrisma(data),
    });

    return ServiceGroupMapper.toDomain(serviceGroup);
  }

  async save(serviceGroup: ServiceGroup): Promise<ServiceGroup> {
    const updatedService = await prismaDb.service_group.update({
      where: { id: serviceGroup.id },
      data: ServiceGroupMapper.toPrisma(serviceGroup),
    });

    return ServiceGroupMapper.toDomain(updatedService);
  }

  async delete(id: string): Promise<void> {
    await prismaDb.service_group.delete({
      where: {
        id,
      }
    });
  }
}
