import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import IUsersRepository, {
  IUserFilters
} from '@modules/users/repositories/IUsersRepository';

import User from '../entities/User';

class UserRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async find({
    role,
    name,
    telephone,
    company_id,
    enabled,
  }: IUserFilters): Promise<User[] | undefined> {
    const user = await this.ormRepository.find({
      order: { username: 'ASC' },
      relations: ['profile', 'profile.company'],
      where: (qb: SelectQueryBuilder<User>) => {
        const filtering = qb.where({
          ...(telephone && { telephone }),
          ...(role && { role }),
          ...(enabled !== undefined && { enabled }),
        });

        if (company_id) {
          filtering.andWhere('User__profile.company_id = :company_id', {
            company_id,
          });
        }

        if (name) {
          qb.andWhere('User__profile.name LIKE :name', {
            name: `%${name}%`,
          });
        }
      },
    });

    return user;
  }

  public async findByCompany(company_id: string): Promise<User[] | undefined> {
    const user = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      where: {
        profile: { company_id },
      },
      relations: ['profile', 'profile.company'],
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      relations: ['profile', 'profile.company'],
      where: { id },
    });

    if(!user) {
      return undefined;
    }

    return user;
  }

  public async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { username },
      relations: ['profile', 'profile.company'],
    });

    if(!user) {
      return undefined;
    }

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
      relations: ['profile', 'profile.company'],
    });

    if(!user) {
      return undefined;
    }

    return user;
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default UserRepository;
