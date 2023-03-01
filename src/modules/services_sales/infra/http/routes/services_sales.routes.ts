import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ServicesSalesController from '../controllers/ServicesSalesController';

const servicesSalesRouter = Router();
const servicesSalesController = new ServicesSalesController();

servicesSalesRouter.post(
  '/',
  RoleMiddleware.isManagerOrSeller,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      isReferred: Joi.boolean().required(),
      saleId: Joi.string().uuid().required(),
      serviceIds: Joi.array().items(Joi.string().uuid().required()).required(),
      referral_data: Joi.object().keys({
        id: Joi.string().required(),
        referredServices: Joi.array().items(Joi.string()).required().min(1),
      }),
    },
  }),
  servicesSalesController.store,
);

export default servicesSalesRouter;
