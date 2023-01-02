import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class GetUsersByCompanyService {
  constructor(
    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Profile[] | undefined> {
    const profileByUserId = await this.profileRepository.findByUser(user_id);

    if (!profileByUserId) {
      throw new AppError('Profile was not found', 404);
    }

    const companyUsers = await this.profileRepository.findByCompanyId(
      profileByUserId.company_id,
    );

    return companyUsers;
  }
}

export default GetUsersByCompanyService;
