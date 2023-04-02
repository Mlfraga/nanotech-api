import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import RoleMiddleware from '@shared/infra/http/middlewares/RoleMiddleware';

import CompaniesSalesBudgetController from '../controllers/CompaniesSalesBudgetController';
import RewardSalesController from '../controllers/RewardSalesController';
import SalesBudgetController from '../controllers/SalesBudgetController';
import SalesController from '../controllers/SalesController';
import SalesReportController from '../controllers/SalesReportController';
import UpdateStatusSaleController from '../controllers/UpdateStatusSaleController';

const salesRouter = Router();
const salesController = new SalesController();
const updateStatusSaleController = new UpdateStatusSaleController();
const rewardSalesController = new RewardSalesController();
const salesReportController = new SalesReportController();
const salesBudgetController = new SalesBudgetController();
const companiesSalesBudgetController = new CompaniesSalesBudgetController();

salesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      startDeliveryDate: Joi.date().allow(null),
      endDeliveryDate: Joi.date().allow(null),
      startAvailabilityDate: Joi.date().allow(null),
      endAvailabilityDate: Joi.date().allow(null),
      startFinishedDate: Joi.date().allow(null),
      endFinishedDate: Joi.date().allow(null),
      companyId: Joi.string().uuid().allow(null),
      status: Joi.string().allow(null),
      sellerId: Joi.string().uuid().allow(null),
      page: Joi.number().required(),
    },
  }),
  ensureAuthenticated,
  salesController.index,
);

salesRouter.get(
  '/rewards/',
  ensureAuthenticated,
  RoleMiddleware.isCommissioner,
  rewardSalesController.show,
);

salesRouter.post(
  '/',
  RoleMiddleware.isManagerOrSeller,
  celebrate({
    [Segments.BODY]: {
      unitId: Joi.string().uuid().required(),
      deliveryDate: Joi.date().required(),
      availabilityDate: Joi.date().required(),
      companyPrice: Joi.number().required(),
      costPrice: Joi.number().required(),
      source: Joi.string().required(),
      name: Joi.string().required(),
      cpf: Joi.string().required(),
      car: Joi.string().required(),
      carPlate: Joi.string().required().min(7).max(8),
      carModel: Joi.string().required(),
      carColor: Joi.string().required(),
      comments: Joi.string().allow(null),
      commissioner_id: Joi.string().uuid(),
    },
  }),
  ensureAuthenticated,
  salesController.store,
);

salesRouter.post(
  '/sale-budget',
  ensureAuthenticated,
  RoleMiddleware.isManagerOrSeller,
  salesBudgetController.create,
);

salesRouter.post(
  '/company-sale-budget',
  celebrate({
    [Segments.BODY]: {
      services: Joi.array().items(Joi.string().uuid()).required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManagerOrSeller,
  companiesSalesBudgetController.create,
);

salesRouter.patch(
  '/status',
  RoleMiddleware.isAdminOrNanotechRepresentative,
  updateStatusSaleController.update,
);

salesRouter.patch(
  '/production-status',
  celebrate({
    [Segments.BODY]: {
      status: Joi.string()
        .valid('TO_DO', 'IN_PROGRESS', 'DONE', 'PENDING')
        .required(),
      sale_ids: Joi.array().items(Joi.string().uuid()).required(),
    },
  }),
  RoleMiddleware.isSaleProvider,
  updateStatusSaleController.updateProductionStatus,
);

salesRouter.get(
  '/sales-report',
  celebrate({
    [Segments.QUERY]: {
      initialDate: Joi.date().allow(null),
      finalDate: Joi.date().allow(null),
      company: Joi.string().uuid().allow(null),
      status: Joi.string().allow(null),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManagerOrAdmin,
  salesReportController.pdfFile,
);

salesRouter.get(
  '/excel-sales-report',
  celebrate({
    [Segments.QUERY]: {
      startRangeFinishedDate: Joi.date().allow(null),
      endRangeFinishedDate: Joi.date().allow(null),
      company: Joi.string().uuid().allow(null),
      status: Joi.string().allow(null),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isManagerOrAdmin,
  salesReportController.excelFile,
);

salesRouter.get(
  '/download/sales-report/:fileName',
  salesReportController.download,
);

salesRouter.delete(
  '/',
  celebrate({
    [Segments.BODY]: {
      ids: Joi.array().items(Joi.string().uuid()).required(),
    },
  }),
  ensureAuthenticated,
  RoleMiddleware.isAdminOrNanotechRepresentative,
  salesController.delete,
);

salesRouter.put(
  '/:id',
  celebrate({
    [Segments.BODY]: {
      car: Joi.string().required(),
      carPlate: Joi.string().required().min(7).max(8),
      carModel: Joi.string().required(),
      carColor: Joi.string().required(),
      comments: Joi.string().allow(null),
      source: Joi.string().required(),
      deliveryDate: Joi.date().required(),
      availabilityDate: Joi.date().required(),
    },
  }),
  ensureAuthenticated,
  salesController.update,
);

export default salesRouter;
