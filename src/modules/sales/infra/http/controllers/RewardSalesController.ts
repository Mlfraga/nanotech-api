import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSalesRewardsByCommissionerService from '../services/ListSalesRewardsByCommissionerService';

export default class RewardSalesController {
  async show(request: Request, response: Response) {
    const {
      start_delivery_date,
      end_delivery_date,
      company_id,
      production_status,
      unit_id,
      status,
      seller_id,
      page,
    } = request.query;

    const user_id = request.user.id;

    const listSalesRewardsByCommissionerService = container.resolve(
      ListSalesRewardsByCommissionerService,
    );

    const sales = await listSalesRewardsByCommissionerService.execute({
      user_id,
      start_delivery_date: start_delivery_date
        ? new Date(start_delivery_date as string)
        : undefined,
      end_delivery_date: end_delivery_date
        ? new Date(end_delivery_date as string)
        : undefined,
      company_id: company_id ? (company_id as string) : undefined,
      production_status: production_status
        ? (production_status as string)
        : undefined,
      unit_id: unit_id ? (unit_id as string) : undefined,
      status: status ? (status as string) : undefined,
      seller_id: seller_id ? (seller_id as string) : undefined,
      page: Number(page),
    });

    return response.json(sales);
  }
}
