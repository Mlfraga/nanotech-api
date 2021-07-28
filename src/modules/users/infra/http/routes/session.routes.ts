import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

const sessionRouter = Router();
const sessionsController = new SessionsController();

sessionRouter.post(
  '/login',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

sessionRouter.post('/refresh', sessionsController.update);

sessionRouter.delete('/logout', sessionsController.delete);

export default sessionRouter;
