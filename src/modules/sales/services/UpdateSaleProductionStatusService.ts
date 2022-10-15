import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Sale from '../infra/typeorm/entities/Sale';
import ISaleRepository from '../repositories/ISaleRepository';

interface IRequest {
  sale_ids: string[];
  status: string;
}

@injectable()
class UpdateSaleProductionStatusService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({ sale_ids, status }: IRequest): Promise<string[]> {
    const updated_sales: Sale[] = [];

    for (const sale_id of sale_ids) {
      const sale = await this.saleRepository.findById(sale_id);

      if (!sale) {
        throw new AppError('This sale was not found', 404);
      }

      const updated_sale = await this.saleRepository.save({
        ...sale,
        production_status: status,
      });

      updated_sales.push(updated_sale);
    }

    const formatted_updated_sales = updated_sales.map(sale => sale.id);

    return formatted_updated_sales;
  }
}

export default UpdateSaleProductionStatusService;
