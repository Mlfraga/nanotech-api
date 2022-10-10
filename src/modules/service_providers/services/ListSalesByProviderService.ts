import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import { ProductionStatusEnum } from '@modules/sales/infra/typeorm/entities/Sale';

import IServiceProviderRepository from '../repositories/IServiceProviderRepository';

interface IListSalesByProvidersParams {
  profile_id: string;
  listFrom: 'yesterday' | 'today' | 'tomorrow';
}

interface ICreateProvidersResponse {
  availability_date: Date;
  date_to_be_done: Date;
  delivery_date: Date;
  id: string;
  status: string;
  production_status: ProductionStatusEnum;
  comments: string;
  sellerName: string;
  car: {
    name: string;
    color: string;
    plate: string;
  };
  unit: {
    name: string;
    company: {
      name: string;
    };
  };
  services: { name: string }[];
}

@injectable()
class ListSalesByServiceProvider {
  constructor(
    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,
  ) {}

  public async execute({
    profile_id,
    listFrom,
  }: IListSalesByProvidersParams): Promise<ICreateProvidersResponse[]> {
    const sales = await this.serviceProviderRepository.findByProviderId(
      profile_id,
      listFrom,
    );

    const formattedSales: ICreateProvidersResponse[] = sales.map(sale => ({
      id: sale.sale.id,
      availability_date: sale.sale.availability_date,
      date_to_be_done: sale.date_to_be_done,
      delivery_date: sale.sale.delivery_date,
      status: sale.sale.status,
      production_status: sale.sale.production_status,
      comments: sale.sale.comments,
      sellerName: sale.sale.seller.name,
      car: {
        name: sale.sale.car.brand,
        color: sale.sale.car.color,
        plate: sale.sale.car.plate,
      },
      unit: {
        name: sale.sale.unit.name,
        company: {
          name: sale.sale.unit.company.name,
        },
      },
      services: sale.sale.services_sales.map(serviceSale => ({
        name: serviceSale.service.name,
      })),
    }));

    return classToClass(formattedSales);
  }
}

export default ListSalesByServiceProvider;
