import ICreateProfileDTO from "@modules/profiles/dtos/ICreateProfileDTO";
import IProfileRepository from "@modules/profiles/repositories/IProfileRepository";
import { users_role_enum } from "@prisma/client";
import { prismaDb } from "@shared/infra/http/server";
import { Profile } from "../../entities/Profile";
import { PrismaProfileMapper } from "../mappers/prisma-profile-mapper";

export default class PrismaProfileRepository implements IProfileRepository {
  public async find(): Promise<Profile[]> {
    const profiles = await prismaDb.profiles.findMany({
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    const formattedProfiles = profiles.map(profile => PrismaProfileMapper.toDomain(profile));

    return formattedProfiles;
  }

  public async findById(id: string): Promise<Profile | undefined> {
    const profile = await prismaDb.profiles.findUnique({
      where: {
        id,
      },
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    if(!profile) {
      return undefined;
    }

    const formattedProfile = PrismaProfileMapper.toDomain(profile)

    return formattedProfile;
  }

  public async findByRole(
    role?:
      | 'SELLER'
      | 'MANAGER'
      | 'ADMIN'
      | 'NANOTECH_REPRESENTATIVE'
      | 'SERVICE_PROVIDER',
    showDisabled?: boolean,
  ): Promise<Profile[]> {
    const profiles = await prismaDb.profiles.findMany({
      where: {
        users: {
          role: role as users_role_enum,
          ...(!showDisabled && {enabled: true}),
        }
      },
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    const formattedProfiles = profiles.map(profile => PrismaProfileMapper.toDomain(profile));

    return formattedProfiles;
  }

  public async findByUser(user_id: string): Promise<Profile | undefined> {
    const profile = await prismaDb.profiles.findFirst({
      where: {
        user_id,
      },
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    if(!profile) {
      return undefined;
    }

    const formattedProfile = PrismaProfileMapper.toDomain(profile)

    return formattedProfile;
  }

  public async findByUnitId(unitId: string): Promise<Profile[]> {
    const profiles = await prismaDb.profiles.findMany({
      where: {
        unit_id: unitId,
      },
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    const formattedProfiles = profiles.map(profile => PrismaProfileMapper.toDomain(profile));

    return formattedProfiles;
  }

  public async create(data: ICreateProfileDTO): Promise<Profile> {
    const profile = await prismaDb.profiles.create({
      data,
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    const formattedProfile = PrismaProfileMapper.toDomain(profile);

    return formattedProfile;
  }

  public async findByCompanyId(companyId: string): Promise<Profile[]> {
    const profiles = await prismaDb.profiles.findMany({
      where: {
        company_id: companyId,
      },
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    const formattedProfiles = profiles.map(profile => PrismaProfileMapper.toDomain(profile));

    return formattedProfiles;
  }

  public async save(profile: Profile): Promise<Profile> {
    const updatedProfile = await prismaDb.profiles.update({
      where: {
        id: profile.id,
      },
      data: PrismaProfileMapper.toPrisma(profile),
      include: {
        unities: true,
        users: true,
        companies: true,
      }
    });

    const formattedProfile = PrismaProfileMapper.toDomain(updatedProfile);

    return formattedProfile;
  }

  public async delete(id: string): Promise<void> {
    prismaDb.profiles.delete({where: {id}});
  }
}
