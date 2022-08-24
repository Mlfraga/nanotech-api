import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import CompanyPricesByCompanyAndServiceController from '../controllers/CompanyPricesByCompanyAndServiceController';
import CompanyPricesByCompanyController from '../controllers/CompanyPricesByCompanyController';
import CompanyPricesController from '../controllers/CompanyPricesController';

const companyPricesRouter = Router();
const companyPricesController = new CompanyPricesController();
const companyPricesByCompanyController = new CompanyPricesByCompanyController();
const companyPricesByCompanyAndServiceController =
  new CompanyPricesByCompanyAndServiceController();

companyPricesRouter.get(
  '/',
  ensureAuthenticated,
  RoleMiddleware.isAdmin,
  companyPricesController.index,
);

companyPricesRouter.get(
  '/company',
  ensureAuthenticated,
  RoleMiddleware.isManagerOrSeller,
  companyPricesByCompanyController.index,
);

companyPricesRouter.get(
  '/sale',
  celebrate({
    [Segments.QUERY]: {
      serviceId: Joi.string().uuid().required(),
      companyId: Joi.string().uuid(),
    },
  }),
  ensureAuthenticated,
  companyPricesByCompanyAndServiceController.index,
);

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

companyPricesRouter.put(
  '/',
  ensureAuthenticated,
  RoleMiddleware.isManager,
  companyPricesController.update,
);

export default companyPricesRouter;
