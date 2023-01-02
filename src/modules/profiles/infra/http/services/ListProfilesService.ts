import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

import Profile from '../../typeorm/entities/Profile';

interface IListProfilesServiceParams {
  user_id: string;
  role: string;
  showDisabled: boolean;
}

@injectable()
class ListProfilesService {
  constructor(
    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,
  ) {}

  public async execute({
    user_id,
    showDisabled,
    role,
  }: IListProfilesServiceParams): Promise<Profile[]> {
    const profile = await this.profileRepository.findByUser(user_id);

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    if (!profile.user) {
      throw new AppError('User not found', 404);
    }

    let profiles: Profile[] = [];

    if (profile.user.role === 'MANAGER') {
      const companyId = profile.company_id;

      profiles = await this.profileRepository.findByCompanyId(companyId);

      return profiles;
    }

    profiles = await this.profileRepository.findByRole(
      role as
        | 'SELLER'
        | 'MANAGER'
        | 'ADMIN'
        | 'NANOTECH_REPRESENTATIVE'
        | 'SERVICE_PROVIDER',
      !!showDisabled,
    );

    return profiles;
  }
}

export default ListProfilesService;
