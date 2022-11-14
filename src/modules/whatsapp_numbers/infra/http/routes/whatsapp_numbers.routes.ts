import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import WhatsappNumberController from '../controllers/WhatsappNumberController';

const whatsappNumbersRouter = Router();

const whatsappNumberController = new WhatsappNumberController();

whatsappNumbersRouter.get(
  '/',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  whatsappNumberController.index,
);

whatsappNumbersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      numbers: Joi.array()
        .items(
          Joi.object().keys({
            number: Joi.string().required(),
            restricted_to_especific_company: Joi.boolean().required(),
            company_id: Joi.string().uuid().allow(null),
          }),
        )
        .required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  whatsappNumberController.store,
);

export default whatsappNumbersRouter;
