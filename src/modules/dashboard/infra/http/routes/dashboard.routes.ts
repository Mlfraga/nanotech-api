import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import CompaniesController from '../controllers/DashboardController';

const dashboardRouter = Router();
const companiesController = new CompaniesController();

dashboardRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      start_date_filter: Joi.date().required(),
      end_date_filter: Joi.date().required(),
      // company_id: Joi.string().uuid(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  companiesController.index,
);

export default dashboardRouter;
