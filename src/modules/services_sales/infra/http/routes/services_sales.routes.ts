import { celebrate, Segments, Joi } from 'celebrate';
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
      saleId: Joi.string().uuid().required(),
      serviceIds: Joi.array().items(Joi.string().uuid().required()).required(),
    },
  }),
  servicesSalesController.store,
);

servicesSalesRouter.get('/', servicesSalesController.index);

servicesSalesRouter.get('/filtered', servicesSalesController.filter);

export default servicesSalesRouter;
