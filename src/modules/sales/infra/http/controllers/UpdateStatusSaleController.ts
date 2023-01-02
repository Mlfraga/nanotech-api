/* eslint-disable no-continue */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateSaleProductionStatusService from '@modules/sales/infra/http/services/UpdateSaleProductionStatusService';

import UpdateSalesStatusService from '../services/UpdateSalesStatusService';

export default class UpdateStatusSaleController {
  async update(request: Request, response: Response) {
    const { status, sales } = request.body;

    const updateSalesStatusService = container.resolve(
      UpdateSalesStatusService,
    );

    const updatedSales = await updateSalesStatusService.execute({
      status,
      sales,
    });

    return response.status(200).json(updatedSales);
  }

  async updateProductionStatus(request: Request, response: Response) {
    const { status, sale_ids } = request.body;

    const updateSaleProductionStatusService = container.resolve(
      UpdateSaleProductionStatusService,
    );

    const updatedSales = await updateSaleProductionStatusService.execute({
      sale_ids,
      status,
      profile_id: request.user.profile_id,
    });

    return response.status(200).json(updatedSales);
  }
}
