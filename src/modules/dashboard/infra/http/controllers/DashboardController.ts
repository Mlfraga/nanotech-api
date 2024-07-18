import { Request, Response } from 'express';
import { container } from 'tsyringe';
import DashboardService from '../services/DashboardService';

export default class DashboardController {
  async index(request: Request, response: Response) {
    const {
      start_date_filter,
      end_date_filter,
      company_id
    } = request.query;

    const dashboardService = container.resolve(DashboardService);
    const dashboard = await dashboardService.execute({
      start_date_filter: new Date(start_date_filter as string),
      end_date_filter: new Date(end_date_filter as string),
      company_id: company_id as string,
    });

    return response.json(dashboard);
  }
}
