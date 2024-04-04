import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ServicesController from '../controllers/ServicesController';

const servicesRouter = Router();
const servicesController = new ServicesController();

servicesRouter.get(
  '/:companyId',
  celebrate({
    [Segments.PARAMS]: {
      companyId: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      showDisabled: Joi.boolean().required(),
    },
  }),
  ensureAuthenticated,
  servicesController.index,
);

servicesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      company_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      commission_amount: Joi.number(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesController.store,
);

servicesRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().allow(null),
      price: Joi.number().allow(null),
      company_price: Joi.number().allow(null),
      commission_amount: Joi.number(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManagerOrAdmin,
  servicesController.update,
);

servicesRouter.patch(
  '/disable/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesController.disable,
);

servicesRouter.patch(
  '/enable/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  servicesController.enable,
);

export default servicesRouter;
