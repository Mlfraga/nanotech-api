import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';
import { celebrate, Joi, Segments } from 'celebrate';
import { Request, Response, Router } from 'express';
import ServicesSalesController from '../controllers/ServicesSalesController';

const servicesSalesRouter = Router();
const servicesSalesController = new ServicesSalesController();

servicesSalesRouter.post(
  '/',
  RoleMiddleware.isManagerOrSeller,
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      isReferred: Joi.boolean().required(),
      saleId: Joi.string().uuid().required(),
      serviceIds: Joi.array().items(Joi.string().uuid().required()).required(),
      referral_data: Joi.object().keys({
        id: Joi.string().required(),
        referredServices: Joi.array().items(Joi.string()).required().min(1),
      }),
    },
  }),
  servicesSalesController.store,
);

servicesSalesRouter.get('/test/:saleId', (req: Request, res: Response) => {
  return res.json({ ok: true });
});

servicesSalesRouter.post(
  '/send-message/:saleId',
  servicesSalesController.sendMessage,
);

export default servicesSalesRouter;
