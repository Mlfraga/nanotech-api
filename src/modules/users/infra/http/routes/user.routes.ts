import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import PasswordUserController from '@modules/users/infra/http/controllers/PasswordUserController';
import UserController from '@modules/users/infra/http/controllers/UserController';

import CompanyUsersController from '../controllers/CompanyUsersController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const userRouter = Router();

const userController = new UserController();
const companyUsersController = new CompanyUsersController();
const passwordUserController = new PasswordUserController();

userRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      role: Joi.string(),
      name: Joi.string(),
      telephone: Joi.string(),
      company_id: Joi.string().uuid(),
      enabled: Joi.bool(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  userController.index,
);

userRouter.get('/get-profile', ensureAuthenticated, userController.show);

userRouter.get(
  '/company',
  ensureAuthenticated,
  RoleMiddleware.isManager,
  companyUsersController.show,
);

userRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      email: Joi.string().required(),
      role: Joi.string(),
      name: Joi.string().required(),
      telephone: Joi.string().required(),
      pix_key_type: Joi.string().valid('PHONE', 'CPF', 'EMAIL', 'RANDOM'),
      pix_key: Joi.string()
        .when('pix_key_type', {
          is: 'PHONE',
          then: Joi.string().min(9).max(13),
        })
        .when('pix_key_type', {
          is: 'CPF',
          then: Joi.string().length(11),
        })
        .when('pix_key_type', {
          is: 'EMAIL',
          then: Joi.string().email(),
        })

        .when('pix_key_type', {
          is: 'RANDOM',
          then: Joi.string().uuid(),
        }),
      company: Joi.string().uuid(),
    },
  }),
  userController.store,
);

userRouter.post(
  '/signup',
  celebrate({
    [Segments.BODY]: {
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string(),
      name: Joi.string().required(),
      telephone: Joi.string().required(),
      enabled: Joi.boolean().required(),
      companyId: Joi.string().uuid().required(),
      unitId: Joi.string().uuid(),
    },
  }),
  userController.signup,
);

userRouter.patch(
  '/reset-password/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  passwordUserController.delete,
);

userRouter.patch(
  '/change-password',
  celebrate({
    [Segments.BODY]: {
      newPassword: Joi.string().required().min(8),
    },
  }),
  ensureAuthenticated,
  passwordUserController.update,
);

userRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      telephone: Joi.string().required(),
      role: Joi.string(),
    },
  }),
  userController.update,
);

userRouter.patch(
  '/disable/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  userController.disable,
);

userRouter.patch(
  '/enable/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  userController.enable,
);

export default userRouter;
