import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarRepository from '@modules/cars/repositories/ICarRepository';

import Sale from '../infra/typeorm/entities/Sale';
import ISaleRepository from '../repositories/ISaleRepository';

interface IRequest {
  car: string;
  carPlate: string;
  carModel: string;
  carColor: string;
  comments: string;
  source: string;
  deliveryDate: Date;
  availabilityDate: Date;
  saleId: string;
}

@injectable()
class UpdateSaleStatusService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('CarRepository')
    private carRepository: ICarRepository,
  ) {}

  public async execute({
    saleId,
    car,
    carPlate,
    carModel,
    carColor,
    comments,
    source,
    deliveryDate,
    availabilityDate,
  }: IRequest): Promise<Sale> {
    const sale = await this.saleRepository.findById(saleId);

    if (!sale) {
      throw new AppError('This sale was not found', 404);
    }

    await this.carRepository.save({
      ...sale.car,
      brand: car,
      plate: carPlate,
      color: carColor,
      model: carModel,
    });

    await this.saleRepository.save({
      ...sale,
      comments,
      source,
      delivery_date: deliveryDate,
      availability_date: availabilityDate,
    });

    const updatedSale = await this.saleRepository.findById(sale.id);

    if (!updatedSale) {
      throw new AppError('This sale was not found', 404);
    }

    return updatedSale;
  }
}

export default UpdateSaleStatusService;
