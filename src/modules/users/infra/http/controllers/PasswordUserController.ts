import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserPasswordService from '@modules/users/services/UpdateUserPasswordService';

export default class UserController {
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

    return response.json(updatedUser);
  }
}
