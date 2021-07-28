import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetUsersByCompanyService from '@modules/users/services/GetUsersByCompanyService';

export default class CompanyUsersController {
  async show(request: Request, response: Response) {
    const { id: user_id } = request.user;

    const getUsersByCompanyService = container.resolve(
      GetUsersByCompanyService,
    );

    const createdUser = await getUsersByCompanyService.execute({ user_id });

    return response.json(createdUser);
  }
}
