import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/infra/http/services/CreateUserService';
import ListUsersService from '@modules/users/infra/http/services/ListUsersService';
import ShowUserService from '@modules/users/infra/http/services/ShowUserService';
import ToggleUserEnabledService from '@modules/users/infra/http/services/ToggleUserEnabledService';
import UpdateUserService from '@modules/users/infra/http/services/UpdateUserService';

export default class UserController {
  async index(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { role, name, telephone, company_id, enabled } = request.query;

    const listUsersService = container.resolve(ListUsersService);

    const users = await listUsersService.execute({
      ...(role && { role: role as string }),
      ...(name && { name: name as string }),
      ...(telephone && { telephone: telephone as string }),
      ...(company_id && { company_id: company_id as string }),
      ...(enabled !== undefined && { enabled: !!enabled }),
      user_id,
    });

    return response.json(users);
  }

  async store(request: Request, response: Response) {
    const {
      username,
      email,
      role,
      name,
      telephone,
      pix_key_type,
      pix_key,
      company,
    } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const createdUser = await createUserService.execute({
      username,
      email,
      password: '12345678',
      role,
      name,
      pix_key_type,
      pix_key,
      telephone,
      companyId: company,
    });

    return response.json(createdUser);
  }

  async signup(request: Request, response: Response) {
    const { username, email, password, role, name, telephone, companyId } =
      request.body;

    const createUserService = container.resolve(CreateUserService);

    const createdUser = await createUserService.execute({
      username,
      email,
      password,
      role,
      name,
      telephone,
      companyId,
    });

    return response.json(createdUser);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, telephone, role } = request.body;

    const updateUserService = container.resolve(UpdateUserService);

    await updateUserService.execute({
      id,
      name,
      telephone,
      role,
    });

    return response.sendStatus(202);
  }

  async show(request: Request, response: Response) {
    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute({ id: String(request.user.id) });

    return response.json(user);
  }

  async disable(request: Request, response: Response) {
    const { id } = request.params;

    const toggleUserEnabled = container.resolve(ToggleUserEnabledService);

    await toggleUserEnabled.execute({ id, enabled: false });

    return response.sendStatus(202);
  }

  async enable(request: Request, response: Response) {
    const { id } = request.params;

    const toggleUserEnabled = container.resolve(ToggleUserEnabledService);

    await toggleUserEnabled.execute({ id, enabled: true });

    return response.sendStatus(202);
  }
}
