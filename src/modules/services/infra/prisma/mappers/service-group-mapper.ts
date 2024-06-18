import { Prisma } from '@prisma/client';
import { ServiceGroup } from '../../entities/ServiceGroup';
import ICreateServiceGroupDTO from '@modules/services/dtos/ICreateServiceGroupDTO';

export type PrismaServiceGroupProvider = Prisma.service_groupGetPayload<{}>;

export class ServiceGroupMapper {
  static toPrisma(data: ICreateServiceGroupDTO) {
    return {
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
    }
  }

  static toDomain(raw: PrismaServiceGroupProvider) {
    return new ServiceGroup(
      {
        name: raw.name,
        description: raw.description || undefined,
        image_url: raw.image_url || undefined,
        created_at: raw.created_at,
        updated_at: raw.created_at,
        enabled: raw.enabled,
      },
      raw.id,
    );
  }
}
