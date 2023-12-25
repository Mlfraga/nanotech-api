import { endOfDay, startOfDay } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IServiceProviderRepository from '@modules/service_providers/repositories/IServiceProviderRepository';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ISaleRepository from '../../../repositories/ISaleRepository';

interface IFormattedSale {
  id: string;
  seller: {
    id: string;
    name: string;
    company: {
      name: string;
      client_identifier: string;
    };
  };
  unit: {
    client_identifier: string;
    name: string;
  };
  client_identifier: number;
  person: {
    name: string;
  };
  comments: string;
  car: {
    brand: string;
    model: string;
    plate: string;
    color: string;
  };
  company_value: number;
  hasAlreadyBeenDirected: boolean;
  cost_value: number;
  availability_date: Date;
  delivery_date: Date;
  status: string;
  services_sales: {
    service: {
      id: string;
      name: string;
    };
    cost_value: number;
    company_value: number;
  }[];
  request_date: Date;
}

interface IListSalesResponse {
  current_page: number;
  total_pages: number;
  total_items: number;
  total_items_page: number;
  items: IFormattedSale[];
}

interface IRequest {
  user_id: string;
  filters: {
    startDeliveryDate?: Date;
    endDeliveryDate?: Date;
    startAvailabilityDate?: Date;
    endAvailabilityDate?: Date;
    startFinishedDate?: Date;
    endFinishedDate?: Date;
    sellerId?: string;
    plate?: string;
    companyId?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
  };
  page: number;
}

@injectable()
class ListSalesService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
    filters,
    page,
  }: IRequest): Promise<IListSalesResponse> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    let statusTyped: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED' | null =
      null;

    if (filters.status) {
      if (
        filters.status === 'PENDING' ||
        filters.status === 'CONFIRMED' ||
        filters.status === 'CANCELED' ||
        filters.status === 'FINISHED'
      ) {
        statusTyped = filters.status;
      }
    }

    let sales;

    if (user.role === 'ADMIN' || user.role === 'NANOTECH_REPRESENTATIVE') {
      sales = await this.saleRepository.findAllSales(Number(page), {
        ...(filters.sellerId && { sellerId: String(filters.sellerId) }),
        ...(filters.plate && { plate: String(filters.plate) }),
        ...(filters.companyId && { companyId: String(filters.companyId) }),
        ...(filters.startDeliveryDate && {
          initialDeliveryDate: startOfDay(
            new Date(filters.startDeliveryDate.toString()),
          ),
        }),
        ...(filters.endDeliveryDate && {
          finalDeliveryDate: endOfDay(
            new Date(filters.endDeliveryDate.toString()),
          ),
        }),
        ...(filters.startAvailabilityDate && {
          initialAvailabilityDate: startOfDay(
            new Date(filters.startAvailabilityDate.toString()),
          ),
        }),
        ...(filters.startFinishedDate && {
          startFinishedDate: startOfDay(
            new Date(filters.startFinishedDate.toString()),
          ),
        }),
        ...(filters.endFinishedDate && {
          endFinishedDate: endOfDay(
            new Date(filters.endFinishedDate.toString()),
          ),
        }),
        ...(filters.endAvailabilityDate && {
          finalAvailabilityDate: endOfDay(
            new Date(filters.endAvailabilityDate.toString()),
          ),
        }),
        ...(filters.status &&
          (filters.status === 'PENDING' ||
            filters.status === 'CONFIRMED' ||
            filters.status === 'CANCELED' ||
            filters.status === 'FINISHED') && { status: filters.status }),
      });
    } else if (user.role === 'SELLER') {
      sales = await this.saleRepository.findBySeller(
        user.profile.id,
        Number(page),
        {
          ...(filters.startDeliveryDate && {
            initialDeliveryDate: startOfDay(
              new Date(filters.startDeliveryDate.toString()),
            ),
          }),
          ...(filters.plate && { plate: String(filters.plate) }),
          ...(filters.endDeliveryDate && {
            finalDeliveryDate: endOfDay(
              new Date(filters.endDeliveryDate.toString()),
            ),
          }),
          ...(filters.startAvailabilityDate && {
            initialAvailabilityDate: startOfDay(
              new Date(filters.startAvailabilityDate.toString()),
            ),
          }),
          ...(filters.startFinishedDate && {
            startFinishedDate: startOfDay(
              new Date(filters.startFinishedDate.toString()),
            ),
          }),
          ...(filters.endFinishedDate && {
            endFinishedDate: endOfDay(
              new Date(filters.endFinishedDate.toString()),
            ),
          }),
          ...(filters.endAvailabilityDate && {
            finalAvailabilityDate: endOfDay(
              new Date(filters.endAvailabilityDate.toString()),
            ),
          }),
          ...(statusTyped && { status: statusTyped }),
        },
      );
    } else {
      sales = await this.saleRepository.findByCompanyAndFinishedStatus(
        user.profile.company_id,
        Number(page),
        {
          ...(filters.sellerId && { sellerId: String(filters.sellerId) }),
          ...(filters.plate && { plate: String(filters.plate) }),
          ...(filters.startDeliveryDate && {
            initialDeliveryDate: startOfDay(
              new Date(filters.startDeliveryDate.toString()),
            ),
          }),
          ...(filters.endDeliveryDate && {
            finalDeliveryDate: endOfDay(
              new Date(filters.endDeliveryDate.toString()),
            ),
          }),
          ...(filters.startAvailabilityDate && {
            initialAvailabilityDate: startOfDay(
              new Date(filters.startAvailabilityDate.toString()),
            ),
          }),
          ...(filters.startFinishedDate && {
            startFinishedDate: startOfDay(
              new Date(filters.startFinishedDate.toString()),
            ),
          }),
          ...(filters.endFinishedDate && {
            endFinishedDate: endOfDay(
              new Date(filters.endFinishedDate.toString()),
            ),
          }),
          ...(filters.endAvailabilityDate && {
            finalAvailabilityDate: endOfDay(
              new Date(filters.endAvailabilityDate.toString()),
            ),
          }),
          ...(statusTyped && { status: statusTyped }),
        },
      );
    }

    const formattedSales = await Promise.all(
      sales.items.map(async sale => {
        const providersBySale = await this.serviceProviderRepository.findBySale(
          sale.id,
        );

        const hasAlreadyBeenDirected = providersBySale.length > 0;

        return {
          id: sale.id,
          seller: {
            id: sale.seller.id,
            name: sale.seller.name,
            company: {
              name: sale.seller.company.name,
              client_identifier: sale.seller.company.client_identifier,
            },
          },
          unit: {
            client_identifier: sale.unit.client_identifier,
            name: sale.unit.name,
          },
          client_identifier: sale.client_identifier,
          person: {
            name: sale.person.name,
          },
          comments: sale.comments,
          car: {
            brand: sale.car.brand,
            model: sale.car.model,
            plate: sale.car.plate,
            color: sale.car.color,
          },
          hasAlreadyBeenDirected,
          company_value: sale.company_value,
          cost_value: sale.cost_value,
          availability_date: sale.availability_date,
          delivery_date: sale.delivery_date,
          status: sale.status,
          production_status: sale.production_status,
          services_sales: sale.services_sales.map(serviceSale => ({
            service: {
              id: serviceSale.service.id,
              name: serviceSale.service.name,
            },
            cost_value: serviceSale.cost_value,
            company_value: serviceSale.company_value,
          })),
          request_date: sale.request_date,
        };
      }),
    );

    return { ...sales, items: formattedSales };
  }
}

export default ListSalesService;
