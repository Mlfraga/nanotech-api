/* eslint-disable no-continue */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import UpdateSaleProductionStatusService from '@modules/sales/services/UpdateSaleProductionStatusService';

import SaleRepository from '../../typeorm/repositories/SaleRepository';

interface IUpdatedSalesErrors {
  sale: string;
  message: string;
}

export default class UpdateStatusSaleController {
  async update(request: Request, response: Response) {
    const { status, sales } = request.body;

    if (
      status !== 'PENDING' &&
      status !== 'CONFIRMED' &&
      status !== 'CANCELED' &&
      status !== 'FINISHED'
    ) {
      throw new AppError('Status not found.', 404);
    }

    const saleRepository = container.resolve(SaleRepository);

    const errors: IUpdatedSalesErrors[] = [];
    const updated_sales: string[] = [];

    for (const sale of sales) {
      const foundSale = await saleRepository.findById(String(sale));

      if (!foundSale) {
        errors.push({ sale, message: 'Sale not found' });

        continue;
      }

      const updatedSale = await saleRepository.save({
        ...foundSale,
        ...(status === 'FINISHED' && { finished_at: new Date() }),
        status,
      });

      updated_sales.push(updatedSale.id);
    }

    return response.status(200).json({ updated_sales, errors });
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
