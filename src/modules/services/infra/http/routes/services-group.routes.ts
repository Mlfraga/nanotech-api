import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ServicesGroupController from '../controllers/ServicesGroupController';

const servicesGroupRouter = Router();
const servicesGroupController = new ServicesGroupController();

servicesGroupRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string(),
      image_url: Joi.string(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupController.store,
);


export default servicesGroupRouter;
