import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetUsersByCompanyService from '@modules/users/infra/http/services/GetUsersByCompanyService';
import { UsersViewModel } from '../view-models/users-view-model';
import { ProfileViewModel } from '@modules/profiles/infra/http/view-models/ProfileViewModel';

export default class CompanyUsersController {
  async show(request: Request, response: Response) {
    const { id: user_id } = request.user;

    const getUsersByCompanyService = container.resolve(
      GetUsersByCompanyService,
    );

    const users = await getUsersByCompanyService.execute({ user_id });

    const formattedUsers = users.map(user => ProfileViewModel.toHttp(user));

    return response.json(formattedUsers);
  }
}
