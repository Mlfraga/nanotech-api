import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../../typeorm/entities/User';

interface IListUsersServiceParams {
  role?: string;
  name?: string;
  telephone?: string;
  company_id?: string;
  enabled?: boolean;
  user_id: string;
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    role,
    name,
    telephone,
    company_id,
    enabled,
  }: IListUsersServiceParams): Promise<User[]> {
    const users = await this.usersRepository.find({
      role,
      name,
      telephone,
      company_id,
      enabled,
    });

    if (!users) {
      throw new AppError('Users not found', 404);
    }

    return users.filter(user => user.id !== user_id);
  }
}

export default ListUsersService;
