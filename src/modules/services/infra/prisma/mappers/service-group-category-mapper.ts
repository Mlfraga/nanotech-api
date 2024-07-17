import { Prisma } from '@prisma/client';
import { ServiceGroupCategory } from '../../entities/ServiceGroupCategory';

export type PrismaServiceGroupCategoryProvider = Prisma.service_group_categoriesGetPayload<{
}>;

export class ServiceGroupCategoryMapper {
  static toPrisma(data: ServiceGroupCategory) {
    return {
      name: data.name,
    }
  }

  static toDomain(raw: PrismaServiceGroupCategoryProvider) {
    return new ServiceGroupCategory(
      {
        name: raw.name,
        created_at: raw.created_at,
        updated_at: raw.created_at,
        service_groups: [],
      },
      raw.id,
    );
  }
}
