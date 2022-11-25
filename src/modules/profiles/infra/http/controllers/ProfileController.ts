import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import ProfileRepository from '../../typeorm/repositories/ProfileRepository';

export default class ProfileController {
  async index(request: Request, response: Response) {
    const { role, showDisabled } = request.query;
    const user_id = request.user.id;

    const profileRepository = container.resolve(ProfileRepository);
    const userRepository = container.resolve(UserRepository);

    const profile = await profileRepository.findByUser(user_id);
    const user = await userRepository.findById(user_id);

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'MANAGER') {
      const companyId = profile.company_id;

      const profiles = await profileRepository.findByCompanyId(companyId);

      return response.json(profiles);
    }

    const profiles = await profileRepository.findByRole(
      role as
        | 'SELLER'
        | 'MANAGER'
        | 'ADMIN'
        | 'NANOTECH_REPRESENTATIVE'
        | 'SERVICE_PROVIDER',
      !!showDisabled,
    );

    return response.json(profiles);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { telephone, name, role } = request.body;

    const profileRepository = container.resolve(ProfileRepository);

    const findProfileById = await profileRepository.findById(String(id));

    if (!findProfileById) {
      return response.status(404).json({ error: 'User does not exists.' });
    }

    const updatedProfile = await profileRepository.save({
      ...findProfileById,
      name,
      user: {
        ...findProfileById.user,
        telephone,
        role,
      },
    });

    return response.json(updatedProfile);
  }
}
