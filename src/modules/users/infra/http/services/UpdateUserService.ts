import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

import IUsersRepository from '../../../repositories/IUsersRepository';

interface IRequest {
  id: string;
  telephone: string;
  role: 'SELLER' | 'MANAGER' | 'ADMIN';
  name: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,
  ) {}

  public async execute({ id, telephone, role, name }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('This user does not exists.');
    }

    await this.profileRepository.save({
      ...user.profile,
      name,
    });

    await this.usersRepository.save({
      ...user,
      telephone,
      ...(role && { role }),
    });
  }
}

export default UpdateUserService;
