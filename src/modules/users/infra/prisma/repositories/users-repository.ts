import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO";
import IUserRepository, { IUserFilters } from "@modules/users/repositories/IUsersRepository";
import { prismaDb } from "@shared/infra/http/server";
import { User } from "../../entities/User";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { users_role_enum } from "@prisma/client";

export default class PrismaUsersRepository implements IUserRepository {
  async findByUsername(username: string): Promise<User | undefined> {
    const user = await prismaDb.users.findUnique({
      where: {
        username
      },
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      }
    });

    if(!user) {
      return undefined;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await prismaDb.users.findUnique({
      where: {
        email
      },
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      }
    });

    if(!user) {
      return undefined;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByCompany(company_id: string): Promise<User[] | undefined> {
    const users = await prismaDb.users.findMany({
      where: {
        profiles: {
          company_id
        }
      },
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      }
    });

    const formattedUsers = users.map(user => PrismaUserMapper.toDomain(user));

    return formattedUsers;
  }

  public async find({
    role,
    name,
    telephone,
    company_id,
    enabled,
  }: IUserFilters): Promise<User[] | undefined> {
    console.log('test: ', {
      ...(role && { role: role as users_role_enum }),
      ...(name && { name: name as string }),
      ...(telephone && { telephone: telephone as string }),
      ...(company_id && { company_id: company_id as string }),
      ...(enabled !== undefined && { enabled: !!enabled }),
    })

    const users = await prismaDb.users.findMany({
      where: {
        ...(role && { role: role as users_role_enum }),
        ...(name && { profiles: {name: { contains: name as string }} }),
        ...(telephone && { telephone: { contains: telephone as string } }),
        ...(company_id && { profiles: { company_id: { equals: company_id as string } }}),
        ...(enabled !== undefined && { enabled: !!enabled }),
      },
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      }
    });

    const formattedUsers = users.map(user => PrismaUserMapper.toDomain(user));

    return formattedUsers;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await prismaDb.users.findUnique({
      where: {
        id,
      },
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      }
    });

    if(!user) {
      return undefined;
    }

    const formattedUser = PrismaUserMapper.toDomain(user)

    return formattedUser;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = await prismaDb.users.create({
      data,
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      }
    });

    const formattedUser = PrismaUserMapper.toDomain(user);

    return formattedUser;
  }

  public async save(user: User): Promise<User> {
    console.log("🚀 ~ PrismaUsersRepository ~ save ~ user:", user.id)
    const updatedUser = await prismaDb.users.update({
      where: {
        id: user.id,
      },
      include: {
        profiles: {
          include: {
            companies: true,
          }
        }
      },
      data: PrismaUserMapper.toPrisma(user),
    });

    const formattedUser = PrismaUserMapper.toDomain(updatedUser);

    return formattedUser;
  }

  public async delete(id: string): Promise<void> {
    prismaDb.users.delete({where: {id}});
  }
}
