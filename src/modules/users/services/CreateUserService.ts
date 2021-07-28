import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';
import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';
import IUnitRepository from '@modules/unities/repositories/IUnitRepository';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  name: string;
  telephone: string;
  companyId: string;
  unitId: string;
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

    @inject('UnitRepository')
    private unitRepository: IUnitRepository,

    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    username,
    email,
    password,
    role,
    name,
    telephone,
    companyId,
    unitId,
  }: IRequest): Promise<IResponse> {
    const userByUsername = await this.usersRepository.findByUsername(username);

    if (userByUsername) {
      throw new AppError('Already has an user with this username.', 409);
    }

    const userByEmail = await this.usersRepository.findByEmail(email);

    if (userByEmail) {
      throw new AppError('Already has an user with this email.', 409);
    }

    if (role === 'SELLER') {
      if (!companyId) {
        throw new AppError('Invalid companyId.', 404);
      }

      if (!unitId) {
        throw new AppError('Invalid unitId.', 404);
      }

      const companyById = await this.companyRepository.findById(companyId);

      if (!companyById) {
        throw new AppError('Invalid companyId.', 404);
      }

      const unitById = await this.unitRepository.findById(unitId);

      if (!unitById) {
        throw new AppError('Invalid unitId.', 404);
      }

      const passwordCrypt = await this.hashProvider.generateHash(password);

      const user = await this.usersRepository.create({
        username,
        telephone,
        email,
        password: passwordCrypt,
        role,
      });

      const profile = await this.profileRepository.create({
        name,
        company_id: companyId,
        unit_id: unitId,
        user_id: user.id,
      });

      return { user, profile };
    }

    if (role === 'MANAGER') {
      if (!companyId) {
        throw new AppError('Invalid companyId.', 404);
      }

      const companyById = await this.companyRepository.findById(companyId);

      if (!companyById) {
        throw new AppError('Invalid companyId', 404);
      }

      const passwordCrypt = await this.hashProvider.generateHash(password);

      const user = await this.usersRepository.create({
        username,
        telephone,
        email,
        password: passwordCrypt,
        role,
      });

      const profile = await this.profileRepository.create({
        name,
        company_id: companyId,
        user_id: user.id,
      });

      return { user, profile };
    }

    if (role === 'ADMIN') {
      const passwordCrypt = await this.hashProvider.generateHash(password);

      const user = await this.usersRepository.create({
        username,
        telephone,
        email,
        password: passwordCrypt,
        role,
      });

      const profile = await this.profileRepository.create({
        name,
        user_id: user.id,
      });

      return { user, profile };
    }

    throw new AppError('Invalid role.', 404);
  }
}

export default ShowUserService;
