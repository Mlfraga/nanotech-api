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
      defaultNanotechPrice: Joi.number(),
      imageUrl: Joi.string(),
      companiesToLink: Joi.array().items(Joi.object({
        id: Joi.string().uuid().required(),
        name: Joi.string(),
        price: Joi.number().required(),
        commission: Joi.number().required(),
      })).required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupController.store,
);

servicesGroupRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      enabled: Joi.boolean(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupController.index,
);

servicesGroupRouter.patch(
  '/status/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupController.toggleNanotechServiceGroupStatus,
);

servicesGroupRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesGroupController.update,
);

export default servicesGroupRouter;
