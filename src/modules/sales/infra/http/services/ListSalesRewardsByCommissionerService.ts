import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ISaleRepository from '../../../repositories/ISaleRepository';
import Sale from '../../typeorm/entities/Sale';

interface IRequest {
  user_id: string;
  start_delivery_date?: Date;
  end_delivery_date?: Date;
  company_id?: string;
  production_status?: string;
  unit_id?: string;
  status?: string;
  seller_id?: string;
  page: number;
}

type ListSalesRewardsByCommissionerServiceResponse = {
  current_page: number;
  total_pages: number;
  total_items: number;
  total_items_page: number;
  items: Sale[];
};

@injectable()
class ListSalesRewardsByCommissionerService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    user_id,
    start_delivery_date,
    end_delivery_date,
    company_id,
    production_status,
    unit_id,
    status,
    seller_id,
    page,
  }: IRequest): Promise<ListSalesRewardsByCommissionerServiceResponse> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.role === 'ADMIN') {
      const sales = await this.saleRepository.findRewardedSales({
        start_delivery_date,
        end_delivery_date,
        company_id,
        production_status,
        unit_id,
        status,
        seller_id,
        page,
      });

      return sales;
    }

    const sales = await this.saleRepository.findRewardedSalesByCommissioner(
      user.profile.id,
      {
        start_delivery_date,
        end_delivery_date,
        company_id,
        production_status,
        unit_id,
        status,
        seller_id,
        page,
      },
    );
    console.log('user');

    return sales;
  }
}

export default ListSalesRewardsByCommissionerService;
