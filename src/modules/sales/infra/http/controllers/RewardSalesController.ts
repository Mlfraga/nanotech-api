import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSalesRewardsByCommissionerService from '../services/ListSalesRewardsByCommissionerService';

export default class RewardSalesController {
  async show(request: Request, response: Response) {
    const user_id = request.user.id;

    const listSalesRewardsByCommissionerService = container.resolve(
      ListSalesRewardsByCommissionerService,
    );

    const sales = await listSalesRewardsByCommissionerService.execute({
      user_id,
    });

    return response.json(sales);
  }
}
