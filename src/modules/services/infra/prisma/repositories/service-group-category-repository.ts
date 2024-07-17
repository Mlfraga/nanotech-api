import { prismaDb } from "@shared/infra/http/server";
import { ServiceGroupCategory } from "../../entities/ServiceGroupCategory";
import IServiceGroupCategoryRepository from "@modules/services/repositories/IServiceGroupCategoryRepository";
import { ServiceGroupCategoryMapper } from "../mappers/service-group-category-mapper";

export default class PrismaServiceGroupCategoryRepository implements IServiceGroupCategoryRepository {

  async find(): Promise<ServiceGroupCategory[]> {
    const serviceGroupCategories = await prismaDb.service_group_categories.findMany({
      orderBy: { created_at: 'asc' },
    });

    const formattedServiceGroupCategories = serviceGroupCategories.map(serviceGroupCategory => ServiceGroupCategoryMapper.toDomain(serviceGroupCategory));

    return formattedServiceGroupCategories;
  }

  async findById(id: string): Promise<ServiceGroupCategory | undefined> {
    const serviceGroupCategory = await prismaDb.service_group_categories.findUnique({
      where: { id },
    });

    if (!serviceGroupCategory) {
      return undefined;
    }

    return ServiceGroupCategoryMapper.toDomain(serviceGroupCategory);
  }

  async create(data: ServiceGroupCategory): Promise<ServiceGroupCategory> {
    const serviceGroupCategory = await prismaDb.service_group_categories.create({
      data: ServiceGroupCategoryMapper.toPrisma(data),
    });

    return ServiceGroupCategoryMapper.toDomain(serviceGroupCategory);
  }

  async save(serviceGroupCategory: ServiceGroupCategory): Promise<ServiceGroupCategory> {
    const updatedService = await prismaDb.service_group_categories.update({
      where: { id: serviceGroupCategory.id },
      data: ServiceGroupCategoryMapper.toPrisma(serviceGroupCategory),
    });

    return ServiceGroupCategoryMapper.toDomain(updatedService);
  }

  async delete(id: string): Promise<void> {
    await prismaDb.service_group_categories.delete({
      where: {
        id,
      }
    });
  }
}
