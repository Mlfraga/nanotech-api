import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import PersonController from '@modules/persons/infra/http/controllers/PersonController';

const personRouter = Router();

const personController = new PersonController();

personRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      cpf: Joi.string().length(11).required(),
      name: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManagerOrSeller,
  personController.store,
);

export default personRouter;
