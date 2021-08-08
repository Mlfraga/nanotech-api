import { classToClass } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authenticationConfig from '@config/authentication';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserRepository from '../repositories/IUsersRepository';

interface IRequest {
  login: string;
  password: string;
}

interface IResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ login, password }: IRequest): Promise<IResponse> {
    const userByUsername = await this.usersRepository.findByUsername(login);
    const userByEmail = await this.usersRepository.findByEmail(login);

    if (!userByEmail && !userByUsername) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const user = userByEmail || userByUsername;

    if (!user?.enabled) {
      throw new AppError('This user is not allowed to access.', 404);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect login/password combination.', 401);
    }

    const { accessTokenSecret, refreshTokenSecret, expiresIn } =
      authenticationConfig.jwt;

    const access_token = sign({}, accessTokenSecret, {
      subject: user.id,
      expiresIn,
    });

    const refresh_token = sign({}, refreshTokenSecret, {
      subject: user.id,
    });

    const recoveredRefreshTokens = await this.cacheProvider.recover<
      Record<string, string>
    >('refresh-tokens');

    const refreshTokens = recoveredRefreshTokens || {};

    refreshTokens[user.id] = refresh_token;

    await this.cacheProvider.save('refresh-tokens', refreshTokens);

    if (user.first_login) {
      await this.usersRepository.save({ ...user, first_login: false });
    }

    return { user: classToClass(user), access_token, refresh_token };
  }
}

export default AuthenticateUserService;
