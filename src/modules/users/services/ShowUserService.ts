import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
}

interface IResponse {
  role: string;
  email: string;
  enabled: boolean;
  username: string;
  profile: Profile;
}

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('This user does not exists.');
    }

    return classToClass(user);
  }
}

export default ShowUserService;
