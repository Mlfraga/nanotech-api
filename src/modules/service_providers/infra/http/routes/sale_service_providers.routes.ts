import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ServiceSaleProviderController from '../controllers/ServiceSaleProviderController';

const saleServiceProviderRouter = Router();

const serviceSaleProviderController = new ServiceSaleProviderController();

saleServiceProviderRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      saleId: Joi.string().uuid().required(),
      saleServiceProviderProfileIds: Joi.array()
        .items(Joi.string().uuid())
        .required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  serviceSaleProviderController.store,
);

export default saleServiceProviderRouter;
