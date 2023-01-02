import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import CompanyPricesController from '../controllers/CompanyPricesController';

const companyPricesRouter = Router();
const companyPricesController = new CompanyPricesController();

companyPricesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      companyId: Joi.string().uuid().required(),
      services: Joi.array().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManager,
  companyPricesController.store,
);

export default companyPricesRouter;
