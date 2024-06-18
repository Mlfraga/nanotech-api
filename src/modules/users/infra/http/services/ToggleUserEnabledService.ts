import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '../../../repositories/IUsersRepository';

interface IRequest {
  id: string;
  enabled: boolean;
}

@injectable()
class ToggleUserEnabledService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id, enabled }: IRequest): Promise<boolean> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('This user was not found.', 404);
    }

    user.enabled = enabled;

    const isServiceUpdated = this.usersRepository.save(user);

    return !!isServiceUpdated;
  }
}

export default ToggleUserEnabledService;
