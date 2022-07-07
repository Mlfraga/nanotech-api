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

userRouter.get('/get-profile', ensureAuthenticated, userController.show);

userRouter.get(
  '/company',
  ensureAuthenticated,
  RoleMiddleware.isManager,
  companyUsersController.show,
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
  userController.store,
);

userRouter.patch(
  '/reset-password/:id',
  ensureAuthenticated,
  RoleMiddleware.isAdmin,
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

export default userRouter;
