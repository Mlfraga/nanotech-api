import { classToClass } from 'class-transformer';
import { injectable, inject } from 'tsyringe';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';
import ISaleRepository from '@modules/sales/repositories/ISaleRepository';

import SaleServiceProvider from '../infra/typeorm/entities/SaleServiceProvider';
import IServiceProviderRepository from '../repositories/IServiceProviderRepository';

interface ICreateProvidersParams {
  profile_ids: string[];
  sale_ids: string[];
  techinical_comments?: string;
  date_to_be_done: Date;
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
    sale_ids,
    date_to_be_done,
    techinical_comments,
  }: ICreateProvidersParams): Promise<ICreateProvidersResponse> {
    const created_providers: SaleServiceProvider[] = [];

    for (const sale_id of sale_ids) {
      const saleById = await this.saleRepository.findById(sale_id);
      await this.serviceProviderRepository.deleteBySale(sale_id);

      if (saleById) {
        if (techinical_comments) {
          await this.saleRepository.save({
            ...saleById,
            techinical_comments,
            production_status: 'TO_DO',
          });
        }

        for (const profile_id of profile_ids) {
          const thisSaleAlreadyLinkedToProvider =
            await this.serviceProviderRepository.findByProviderAndSaleId(
              profile_id,
              sale_id,
            );

          const profileById = await this.profileRepository.findById(profile_id);

          if (profileById && !thisSaleAlreadyLinkedToProvider) {
            const createdSaleServiceProvider =
              await this.serviceProviderRepository.create({
                sale_id,
                service_provider_profile_id: profile_id,
                date_to_be_done,
              });

            created_providers.push(createdSaleServiceProvider);
          }
        }
      }
    }
    return classToClass({ created_providers });
  }
}

export default CreateSaleServiceProvidersService;
