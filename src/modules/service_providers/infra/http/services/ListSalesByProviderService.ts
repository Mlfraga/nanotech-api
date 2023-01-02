import { injectable, inject } from 'tsyringe';

import IServiceProviderRepository from '../../../repositories/IServiceProviderRepository';

interface IListSalesByProvidersParams {
  profile_id: string;
  listFrom: 'yesterday' | 'today' | 'tomorrow';
}

interface IListeSalesByProviderResponse {
  availability_date: Date;
  date_to_be_done: Date;
  delivery_date: Date;
  id: string;
  client_identifier: string;
  status: string;
  production_status: string;
  techinical_comments: string;
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
  services: { name: string; id: string }[];
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
  }: IListSalesByProvidersParams): Promise<IListeSalesByProviderResponse[]> {
    const sales = await this.serviceProviderRepository.findByProviderId(
      profile_id,
      listFrom,
    );

    const formattedSales: IListeSalesByProviderResponse[] = sales.map(sale => ({
      id: sale.sale.id,
      availability_date: sale.sale.availability_date,
      date_to_be_done: sale.date_to_be_done,
      delivery_date: sale.sale.delivery_date,
      client_identifier: String(sale.sale.client_identifier),
      status: sale.sale.status,
      production_status: sale.sale.production_status,
      comments: sale.sale.comments,
      techinical_comments: sale.sale.techinical_comments,
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
        id: serviceSale.id,
      })),
    }));

    return formattedSales;
  }
}

export default ListSalesByServiceProvider;
