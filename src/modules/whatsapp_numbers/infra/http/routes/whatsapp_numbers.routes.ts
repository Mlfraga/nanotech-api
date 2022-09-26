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
      number: Joi.string().required(),
      restrictedToEspecificCompany: Joi.boolean().required(),
      companyId: Joi.string().uuid(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  whatsappNumberController.store,
);

export default whatsappNumbersRouter;
