import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UserRepository from '@modules/users/infra/prisma/repositories/users-repository';

dotenv.config();

class RoleMiddleware {
  async isAdminOrNanotechRepresentative(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);

    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (user.role !== 'ADMIN' && user.role !== 'NANOTECH_REPRESENTATIVE') {
      throw new AppError('User does not have admin permission.');
    }

    next();
  }

  async isAdmin(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);

    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (user.role !== 'ADMIN') {
      throw new AppError('User does not have admin permission.');
    }

    next();
  }

  async isManager(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);
    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (user.role !== 'MANAGER') {
      throw new AppError('User does not have manager permission.');
    }

    next();
  }

  async isManagerOrAdmin(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);
    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (
      user.role !== 'MANAGER' &&
      user.role !== 'ADMIN' &&
      user.role !== 'NANOTECH_REPRESENTATIVE'
    ) {
      throw new AppError(
        'User does not have manager, nanotech representative or admin permission.',
      );
    }

    next();
  }

  async isManagerOrSeller(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);

    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (user.role !== 'MANAGER' && user.role !== 'SELLER') {
      throw new AppError('User does not have manager or seller permission.');
    }

    next();
  }

  async isSaleProvider(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);

    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (user.role !== 'SERVICE_PROVIDER') {
      throw new AppError('User does not have sale provider permission.');
    }

    next();
  }

  async isCommissioner(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);

    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (user.role !== 'COMMISSIONER') {
      throw new AppError('User does not have commissioner permission.');
    }

    next();
  }

  async isCommissionerOrAdmin(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader?.split(' ')[1];
    const decoded: any = JWT.decode(String(token), { complete: true });

    const userRepository = container.resolve(UserRepository);

    const user_id = decoded.payload.sub;

    const user = await userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    request.user = {
      ...request.user,
      profile_id: user.profile?.id as string,
    };

    if (
      user.role !== 'COMMISSIONER' &&
      user.role !== 'ADMIN' &&
      user.role !== 'MANAGER'
    ) {
      throw new AppError(
        'User does not have commissioner,admin,manager permission.',
      );
    }

    next();
  }
}

export default new RoleMiddleware();
