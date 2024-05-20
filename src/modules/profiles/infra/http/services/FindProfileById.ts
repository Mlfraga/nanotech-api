import { injectable, inject } from 'tsyringe';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

import {Profile} from '../../entities/Profile';

interface IRequest {
  id: string;
}

@injectable()
class FindProfileById {
  constructor(
    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Profile | string> {
    const company = await this.profileRepository.findById(id);

    if (!company) {
      return 'company not found';
    }

    return company;
  }
}

export default FindProfileById;
