import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import ShowUserService from '@modules/users/services/ShowUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class UserController {
  async store(request: Request, response: Response) {
    const {
      username,
      email,
      password,
      role,
      name,
      telephone,
      companyId,
      unitId,
    } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const createdUser = await createUserService.execute({
      username,
      email,
      password,
      role,
      name,
      telephone,
      companyId,
      unitId,
    });

    return response.json(createdUser);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, telephone, role } = request.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute({
      id,
      name,
      telephone,
      role,
    });

    return response.json(user);
  }

  async show(request: Request, response: Response) {
    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute({ id: String(request.user.id) });

    return response.json(user);
  }
}
