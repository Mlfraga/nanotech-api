/* eslint-disable no-continue */
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSalesService from '@modules/sales/infra/http/services/ListSalesService';
import UpdateSaleService from '@modules/sales/infra/http/services/UpdateSaleService';

import SaleRepository from '../../typeorm/repositories/SaleRepository';
import CreateSaleService from '../services/CreateSaleService';
import DeleteSalesService from '../services/DeleteSaleService';

export default class SalesController {
  async teste(request: Request, response: Response) {
    const { providerId } = request.query;

    const saleRepository = container.resolve(SaleRepository);

    const sales = await saleRepository.findByServiceProvider(
      String(providerId),
    );

    return response.json(sales);
  }

  async index(request: Request, response: Response) {
    const {
      startDeliveryDate,
      endDeliveryDate,
      startAvailabilityDate,
      endAvailabilityDate,
      startFinishedDate,
      endFinishedDate,
      sellerId,
      companyId,
      status,
      page,
    } = request.query;

    const user_id = request.user.id;

    const listSalesService = container.resolve(ListSalesService);

    const sales = await listSalesService.execute({
      user_id,
      filters: {
        ...(startDeliveryDate && {
          startDeliveryDate: new Date(String(startDeliveryDate)),
        }),
        ...(endDeliveryDate && {
          endDeliveryDate: new Date(String(endDeliveryDate)),
        }),
        ...(startAvailabilityDate && {
          startAvailabilityDate: new Date(String(startAvailabilityDate)),
        }),
        ...(endAvailabilityDate && {
          endAvailabilityDate: new Date(String(endAvailabilityDate)),
        }),
        ...(startFinishedDate && {
          startFinishedDate: new Date(String(startFinishedDate)),
        }),
        ...(endFinishedDate && {
          endFinishedDate: new Date(String(endFinishedDate)),
        }),
        ...(sellerId && { sellerId: String(sellerId) }),
        ...(companyId && { companyId: String(companyId) }),
        ...(status && {
          status: status as 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED',
        }),
      },
      page: Number(page),
    });

    return response.json(sales);
  }

  async store(request: Request, response: Response) {
    const {
      deliveryDate,
      availabilityDate,
      comments,
      companyPrice,
      costPrice,
      source,
      name,
      cpf,
      car,
      carPlate,
      carColor,
      carModel,
      unitId,
    } = request.body;

    const user_id = request.user.id;

    const createSaleService = container.resolve(CreateSaleService);

    await createSaleService.execute({
      user_id,
      deliveryDate,
      availabilityDate,
      comments,
      companyPrice,
      costPrice,
      source,
      name,
      cpf,
      car,
      carPlate,
      carColor,
      carModel,
      unitId,
    });

    return response.sendStatus(202);
  }

  async delete(request: Request, response: Response) {
    const { ids } = request.body;

    const deleteSalesService = container.resolve(DeleteSalesService);

    const deletedSales = deleteSalesService.execute({ saleIds: ids });

    return response.status(200).json(deletedSales);
  }

  async update(request: Request, response: Response) {
    const { id: saleId } = request.params;
    const {
      car,
      carPlate,
      carModel,
      carColor,
      comments,
      source,
      deliveryDate,
      availabilityDate,
    } = request.body;

    const updateSaleService = container.resolve(UpdateSaleService);

    const updatedSale = await updateSaleService.execute({
      saleId,
      car,
      carPlate,
      carModel,
      carColor,
      comments,
      source,
      deliveryDate,
      availabilityDate,
    });

    return response.status(200).json(updatedSale);
  }
}
