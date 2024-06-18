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

    if(user.profile) {
      user.profile.name = name;

      await this.profileRepository.save(user.profile);
    }

    user.telephone = telephone;
    user.role = role;

    await this.usersRepository.save(user);
  }
}

export default UpdateUserService;
