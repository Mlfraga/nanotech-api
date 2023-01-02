import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import CompaniesController from '../controllers/CompaniesController';

const companiesRouter = Router();
const companiesController = new CompaniesController();

companiesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      telephone: Joi.string().min(9).max(11).required(),
      cnpj: Joi.string().length(14).required(),
      client_identifier: Joi.string().length(2).required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  companiesController.store,
);

companiesRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      telephone: Joi.string().min(9).max(11),
      cnpj: Joi.string().length(14),
      client_identifier: Joi.string().length(2),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  companiesController.update,
);

companiesRouter.get(
  '/',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  companiesController.index,
);

companiesRouter.get(
  '/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  companiesController.show,
);

export default companiesRouter;
