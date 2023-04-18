import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ISaleRepository from '../../../repositories/ISaleRepository';
import Sale from '../../typeorm/entities/Sale';

interface IRequest {
  user_id: string;
}

@injectable()
class ListSalesRewardsByCommissionerService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Sale[]> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }
    if (user.role === 'ADMIN' || user.role === 'MANAGER') {
      const sales = await this.saleRepository.findAllSales(0, {});
      console.log('admin');
      return sales.items;
    }
    const sales = await this.saleRepository.findRewardedSalesByCommissioner(
      user.profile.id,
    );
    console.log('user');

    return sales;
  }
}

export default ListSalesRewardsByCommissionerService;
