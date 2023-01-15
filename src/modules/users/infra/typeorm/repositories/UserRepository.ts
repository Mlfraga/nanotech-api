import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '../entities/User';

class UserRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async find(): Promise<User[] | undefined> {
    const user = await this.ormRepository.find({
      order: { username: 'ASC' },
      relations: ['profile', 'profile.company'],
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
