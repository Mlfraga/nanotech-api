import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<User[]> {
    const users = await this.usersRepository.find();

    if (!users) {
      throw new AppError('Users not found', 404);
    }

    return classToClass(users.filter(user => user.id !== user_id));
  }
}

export default ListUsersService;
