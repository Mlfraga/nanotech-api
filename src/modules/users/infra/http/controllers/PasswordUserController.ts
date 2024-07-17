import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetUserPasswordService from '@modules/users/infra/http/services/ResetUserPasswordService';
import UpdateUserPasswordService from '@modules/users/infra/http/services/UpdateUserPasswordService';
import { UsersViewModel } from '../view-models/users-view-model';

export default class PasswordUserController {
  async update(request: Request, response: Response) {
    const { newPassword } = request.body;
    const { id: user_id } = request.user;

    const updateUserPasswordService = container.resolve(
      UpdateUserPasswordService,
    );

    const updatedUser = await updateUserPasswordService.execute({
      newPassword,
      user_id,
    });

    return response.json(UsersViewModel.toHttp(updatedUser));
  }

  async delete(request: Request, response: Response) {
    const { id: user_id } = request.params;

    const resetUserPasswordService = container.resolve(
      ResetUserPasswordService,
    );

    await resetUserPasswordService.execute({ user_id });

    return response.sendStatus(202);
  }
}
