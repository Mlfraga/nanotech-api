import { injectable, inject } from 'tsyringe';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

import {Profile} from '../../entities/Profile';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

@injectable()
class FindProfileById {
  constructor(
    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Profile> {
    const company = await this.profileRepository.findById(id);

    if (!company) {
      throw new AppError('company not found');
    }

    return company;
  }
}

export default FindProfileById;
