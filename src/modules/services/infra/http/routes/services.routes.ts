import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ServicesController from '../controllers/ServicesController';

const servicesRouter = Router();
const servicesController = new ServicesController();

servicesRouter.get('/', ensureAuthenticated, servicesController.index);

servicesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdmin,
  servicesController.store,
);

servicesRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().allow(null),
      price: Joi.number().allow(null),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdmin,
  servicesController.update,
);

export default servicesRouter;
