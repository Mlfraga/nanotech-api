import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/infra/http/services/AuthenticateUserService';
import LogOutUserService from '@modules/users/infra/http/services/LogOutUserService';
import RefreshAccessTokenService from '@modules/users/infra/http/services/RefreshAccessTokenService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    console.log('username', username);
    console.log('password', password);

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const authenticatedUser = await authenticateUserService.execute({
      login: username,
      password,
    });

    return response.status(200).json(authenticatedUser);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { token: refresh_token } = request.body;

    const refreshAccessToken = container.resolve(RefreshAccessTokenService);

    const { access_token } = await refreshAccessToken.execute({
      refresh_token,
    });

    return response.json({ access_token });
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { access_token } = request.body;

    const logOutUser = container.resolve(LogOutUserService);

    await logOutUser.execute({
      access_token,
    });

    return response.json().send();
  }
}
