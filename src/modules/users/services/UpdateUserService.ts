import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  id: string;
  telephone: string;
  role: 'SELLER' | 'MANAGER' | 'ADMIN';
  name: string;
}

interface IResponse {
  email: string;
  role: string;
  enabled: boolean;
  username: string;
  profile: Profile;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,
  ) {}

  public async execute({
    id,
    telephone,
    role,
    name,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('This user does not exists.');
    }

    await this.usersRepository.save({
      ...user,
      telephone,
      ...(role && { role }),
    });

    await this.profileRepository.save({
      ...user.profile,
      name,
    });

    return classToClass({
      ...user,
      telephone,
      ...(role && { role }),
      ...user.profile,
      name,
    });
  }
}

export default UpdateUserService;
