import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import ensureAuthenticated from '../../../../../shared/infra/http/middlewares/ensureAuthenticated';
import CommissionersController from '../controllers/CommissionersController';

const commissionersRouter = Router();
const commissionersController = new CommissionersController();

commissionersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      telephone: Joi.string().min(9).max(11).required(),
      company_id: Joi.string().uuid().required(),
      pix_key: Joi.string().required().when('pix_key_type', {
        is: 'PHONE',
        then: Joi.string().min(9).max(13)
      }).when('pix_key_type', {
        is: 'CPF',
        then: Joi.string().length(11)
      }).when('pix_key_type', {
        is: 'EMAIL',
        then: Joi.string().email()
      }).when('pix_key_type', {
        is: 'RANDOM',
        then: Joi.string().uuid()
      }),
      pix_key_type: Joi.string().valid('PHONE', 'CPF', 'EMAIL', 'RANDOM').required()
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  commissionersController.store,
);

commissionersRouter.get(
  '/:company_id',
  celebrate({
    [Segments.PARAMS]: {
      company_id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  commissionersController.index
);

commissionersRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      telephone: Joi.string().min(9).max(11).required(),
      enabled: Joi.boolean().required(),
      pix_key: Joi.string().required().when('pix_key_type', {
        is: 'PHONE',
        then: Joi.string().min(9).max(13)
      }).when('pix_key_type', {
        is: 'CPF',
        then: Joi.string().length(11)
      }).when('pix_key_type', {
        is: 'EMAIL',
        then: Joi.string().email()
      }).when('pix_key_type', {
        is: 'RANDOM',
        then: Joi.string().uuid()
      }),
      pix_key_type: Joi.string().valid('PHONE', 'CPF', 'EMAIL', 'RANDOM').required()
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  commissionersController.update
);

commissionersRouter.patch(
  '/:id/toggle-enabled',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      enabled: Joi.boolean().required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  commissionersController.updateEnabled
);

export default commissionersRouter;
