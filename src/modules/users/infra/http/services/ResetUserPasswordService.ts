import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '../../../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../../../repositories/IUsersRepository';
import { User } from '../../entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ResetUserPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const userById = await this.usersRepository.findById(user_id);

    if (!userById) {
      throw new AppError('This user was not found.', 404);
    }

    const defaultPassword = '12345678';

    const passwordCrypt = await this.hashProvider.generateHash(defaultPassword);

    userById.password = passwordCrypt;
    userById.first_login = true;

    await this.usersRepository.save(userById);

    return userById;
  }
}

export default ResetUserPasswordService;
