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
      date_to_be_done: Joi.date().required(),
      sale_ids: Joi.array().items(Joi.string().uuid()).required(),
      sale_service_provider_profile_ids: Joi.array()
        .items(Joi.string().uuid())
        .required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  serviceSaleProviderController.store,
);

saleServiceProviderRouter.get(
  '/sales/provider/',
  celebrate({
    [Segments.QUERY]: {
      listFrom: Joi.string().valid('yesterday', 'today', 'tomorrow').required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isSaleProvider,
  serviceSaleProviderController.showSales,
);

export default saleServiceProviderRouter;
