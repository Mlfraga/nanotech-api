/* eslint-disable no-continue */
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ISaleRepository from '../../../repositories/ISaleRepository';

interface IUpdateSalesStatusServiceParams {
  sales: string[];
  status: string;
}

interface IUpdatedSalesErrors {
  sale: string;
  message: string;
}

interface IUpdateSalesStatusServiceResponse {
  errors: IUpdatedSalesErrors[];
  updated_sales: string[];
}

@injectable()
class UpdateSalesStatusService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({
    status,
    sales,
  }: IUpdateSalesStatusServiceParams): Promise<IUpdateSalesStatusServiceResponse> {
    if (
      status !== 'PENDING' &&
      status !== 'CONFIRMED' &&
      status !== 'CANCELED' &&
      status !== 'FINISHED'
    ) {
      throw new AppError('Status not found.', 404);
    }

    const errors: IUpdatedSalesErrors[] = [];
    const updated_sales: string[] = [];

    for (const sale of sales) {
      const foundSale = await this.saleRepository.findById(String(sale));

      if (!foundSale) {
        errors.push({ sale, message: 'Sale not found' });

        continue;
      }

      foundSale.status = status;
      if(sale === 'FINISHED'){
        foundSale.finished_at = new Date();
      }

      const updatedSale = await this.saleRepository.save(foundSale);

      updated_sales.push(updatedSale.id);
    }

    return { errors, updated_sales };
  }
}

export default UpdateSalesStatusService;
