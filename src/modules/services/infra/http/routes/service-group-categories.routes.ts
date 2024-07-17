import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ServiceGroupCategoriesController from '../controllers/ServiceGroupCategoriesController';

const serviceGroupCategoriesRouter = Router();
const servicesGroupCategoriesController = new ServiceGroupCategoriesController();

serviceGroupCategoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupCategoriesController.store,
);

serviceGroupCategoriesRouter.get(
  '/',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupCategoriesController.index,
);

export default serviceGroupCategoriesRouter;
