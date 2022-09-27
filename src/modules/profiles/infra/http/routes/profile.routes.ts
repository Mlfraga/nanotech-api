import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ProfileController from '@modules/profiles/infra/http/controllers/ProfileController';

const profileRouter = Router();

const userController = new ProfileController();

profileRouter.get(
  '/',
  ensureAuthenticated,
  RoleMiddleware.isManagerOrAdmin,
  userController.index,
);

profileRouter.put(
  '/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  userController.update,
);

export default profileRouter;
