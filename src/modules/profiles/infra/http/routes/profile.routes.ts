import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ProfileController from '@modules/profiles/infra/http/controllers/ProfileController';

const profileRouter = Router();

const userController = new ProfileController();

profileRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      role: Joi.string().valid(
        'ADMIN',
        'SELLER',
        'MANAGER',
        'NANOTECH_REPRESENTATIVE',
        'SERVICE_PROVIDER',
      ),
      showDisabled: Joi.boolean(),
    },
  }),
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
