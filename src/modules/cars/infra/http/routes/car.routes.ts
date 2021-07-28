import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import CarController from '../controllers/CarController';

const carRouter = Router();

const carController = new CarController();

carRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      personId: Joi.string().uuid().required(),
      car: Joi.string().required(),
      carColor: Joi.string().required(),
      carModel: Joi.string(),
      carPlate: Joi.string().min(6).max(8).required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManagerOrSeller,
  carController.store,
);

export default carRouter;
