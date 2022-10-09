import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import SaleServiceProvider from '../infra/typeorm/entities/SaleServiceProvider';
import IServiceProviderRepository from '../repositories/IServiceProviderRepository';

interface ICreateProvidersParams {
  profile_id: string;
}

interface ICreateProvidersResponse {
  availability_date: Date;
  delivery_date: Date;
  status: string;
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
  }: ICreateProvidersParams): Promise<ICreateProvidersResponse[]> {
    const sales = await this.serviceProviderRepository.findByProviderId(
      profile_id,
    );

    const formattedSales: ICreateProvidersResponse[] = sales.map(sale => ({
      availability_date: sale.sale.availability_date,
      delivery_date: sale.sale.delivery_date,
      status: sale.sale.status,
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
