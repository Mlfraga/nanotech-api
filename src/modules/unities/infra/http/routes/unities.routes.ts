import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import UnitsByCompanyController from '../controllers/UnitsByCompanyController';
import UnitsController from '../controllers/UnitsController';

const unitiesRouter = Router();
const unitsController = new UnitsController();
const unitsByCompanyController = new UnitsByCompanyController();

unitiesRouter.get('/', ensureAuthenticated, unitsController.index);

unitiesRouter.get(
  '/:company_id',
  ensureAuthenticated,
  unitsByCompanyController.index,
);

unitiesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      telephone: Joi.string().min(9).max(11).required(),
      companyId: Joi.string().uuid().required(),
      client_identifier: Joi.string().length(2).required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdmin,
  unitsController.store,
);

unitiesRouter.put(
  '/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdmin,
  unitsController.update,
);

export default unitiesRouter;
