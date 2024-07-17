import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceSaleRepository from '@modules/services_sales/repositories/IServiceSaleRepository';

import ISaleRepository from '../../../repositories/ISaleRepository';

interface IDeleteSalesServiceParams {
  saleIds: string[];
}

interface IDeleteSalesServiceResponse {
  message: string;
  errors: { id: string; message: string }[];
}

@injectable()
class DeleteSalesService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('ServiceSaleRepository')
    private serviceSaleRepository: IServiceSaleRepository,
  ) {}

  public async execute({
    saleIds,
  }: IDeleteSalesServiceParams): Promise<IDeleteSalesServiceResponse> {
    const errors = [];

    try {
      for (const id of saleIds) {
        const saleExists = await this.saleRepository.findById(String(id));

        if (!saleExists) {
          errors.push({ id, message: 'Sale not found.' });
        } else {
          for (const serviceSale of saleExists.services_sales) {
            await this.serviceSaleRepository.delete(serviceSale.id);
          }
          await this.saleRepository.delete(String(saleExists.id));
        }
      }

      return { message: 'Success', errors };
    } catch (err) {
      throw new AppError('An error has occurred on sale deleting.');
    }
  }
}

export default DeleteSalesService;
