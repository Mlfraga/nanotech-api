import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

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

    if (user.role !== 'MANAGER' && user.role !== 'SELLER') {
      throw new AppError('User does not have manager or seller permission.');
    }

    next();
  }
}

export default new RoleMiddleware();
