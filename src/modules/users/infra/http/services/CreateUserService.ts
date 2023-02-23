import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';
import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';

import IHashProvider from '../../../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../../typeorm/entities/User';

interface IRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  name: string;
  telephone: string;
  companyId: string;
  pix_key_type?:  string;
  pix_key?: string;
}

interface IResponse {
  user: User;
  profile: Profile;
}

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,

    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(request: IRequest): Promise<IResponse> {
    const {username, email, password, role, name, telephone, companyId, pix_key_type, pix_key} = request;

    if (role === 'SELLER' || role === 'MANAGER' || role === 'COMMISSIONER') {
      if (!companyId) {
        throw new AppError('Invalid companyId.', 404);
      }

      const companyById = await this.companyRepository.findById(companyId);

      if (!companyById) {
        throw new AppError('Invalid companyId.', 404);
      }
    }

    const userByUsername = await this.usersRepository.findByUsername(username);

    if (userByUsername) {
        throw new AppError('Already has an user with this username.', 409);
    }

    const userByEmail = await this.usersRepository.findByEmail(email);

    if (userByEmail) {
        throw new AppError('Already has an user with this email.', 409);
    }

    const passwordCrypt = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
        username,
        telephone,
        email,
        password: passwordCrypt,
        pix_key,
        pix_key_type: pix_key_type as "CPF" | "PHONE" | "EMAIL" | "RANDOM" | undefined,
        role: role as "SELLER" | "MANAGER" | "COMMISSIONER" | "ADMIN" | "NANOTECH_REPRESENTATIVE" | "SERVICE_PROVIDER",
    });

    let profile: Profile | undefined;

    if (role === 'SELLER' || role === 'MANAGER' || role === 'COMMISSIONER') {
        profile = await this.profileRepository.create({
            name,
            company_id: companyId,
            user_id: user.id,
        });
    } else {
        profile = await this.profileRepository.create({
            name,
            user_id: user.id,
        });
    }

    return { user, profile };
  }
}

export default ShowUserService;
