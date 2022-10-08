import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';
import ISaleRepository from '@modules/sales/repositories/ISaleRepository';

import SaleServiceProvider from '../infra/typeorm/entities/SaleServiceProvider';
import IServiceProviderRepository from '../repositories/IServiceProviderRepository';

interface ICreateProvidersParams {
  profile_ids: string[];
  sale_id: string;
}

interface ICreateProvidersResponse {
  created_providers: SaleServiceProvider[];
}

@injectable()
class CreateSaleServiceProvidersService {
  constructor(
    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,

    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,
  ) {}

  public async execute({
    profile_ids,
    sale_id,
  }: ICreateProvidersParams): Promise<ICreateProvidersResponse> {
    const saleById = await this.saleRepository.findById(sale_id);

    if (!saleById) {
      throw new AppError('This sale was not found.', 404);
    }

    const created_providers: SaleServiceProvider[] = [];

    for (const profile_id of profile_ids) {
      const userById = await this.profileRepository.findById(profile_id);

      if (!userById) {
        throw new AppError('This profile was not found.', 404);
      }

      const createdSaleServiceProvider =
        await this.serviceProviderRepository.create({
          sale_id,
          service_provider_profile_id: profile_id,
        });

      created_providers.push(createdSaleServiceProvider);
    }

    return classToClass({ created_providers });
  }
}

export default CreateSaleServiceProvidersService;
