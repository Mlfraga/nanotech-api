import { Request, Response } from 'express';
import { container } from 'tsyringe';

import FindProfileById from '../services/FindProfileById';
import ListProfilesService from '../services/ListProfilesService';
import { ProfileViewModel } from '../view-models/ProfileViewModel';

export default class ProfileController {
  async index(request: Request, response: Response) {
    const { role, showDisabled } = request.query;
    const user_id = request.user.id;

    const listProfilesService = container.resolve(ListProfilesService);

    const profiles = await listProfilesService.execute({
      user_id,
      role: role as string,
      showDisabled: Boolean(showDisabled),
    });

    const formattedProfiles = profiles.map(item =>
      ProfileViewModel.toHttp(item),
    );

    return response.json(formattedProfiles);
  }

  async find(request: Request, response: Response) {
    const { id } = request.params;

    const findProfileById = container.resolve(FindProfileById);

    const company = await findProfileById.execute({ id });

    return response.json(company);
  }
}
