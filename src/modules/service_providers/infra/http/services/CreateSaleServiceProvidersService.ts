import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { injectable, inject } from 'tsyringe';

import IWppMessagesProvider from '@shared/container/providers/WppMessagesProvider/models/IWppMessagesProvider';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';
import ISaleRepository from '@modules/sales/repositories/ISaleRepository';

import IServiceProviderRepository from '../../../repositories/IServiceProviderRepository';
import SaleServiceProvider from '../../typeorm/entities/SaleServiceProvider';

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

    @inject('WppMessagesProvider')
    private wppMessagesProvider: IWppMessagesProvider,
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
          const profileById = await this.profileRepository.findById(profile_id);

          if (profileById) {
            const createdSaleServiceProvider =
              await this.serviceProviderRepository.create({
                sale_id,
                service_provider_profile_id: profile_id,
                date_to_be_done,
              });

            let servicesMessage = '';

            saleById.services_sales.forEach((serv, index) => {
              if (index === 0) {
                servicesMessage += `${serv.service.name}`;
              } else {
                servicesMessage += ` | ${serv.service.name}`;
              }
            });

            const formattedMessage = `*NOVO SERVIÇO DIRECIONADO PARA VOCÊ*\n\nDETALHES DO SERVIÇO: \n\nData a ser realizado:* ${format(addHours(new Date(String(date_to_be_done)), -3),"dd'/'MM'/'yyyy", { locale: ptBR },)}\n\nData de entrega:* ${format(addHours(new Date(String(saleById.delivery_date)), -3),"dd'/'MM'/'yyyy '-' HH:mm'h'", { locale: ptBR },)}\n\nVendedor(a):* ${saleById.seller.name}\n\nConcessionária:* ${saleById.unit.company.name}\n\nUnidade:* ${saleById.unit.name}\n\nCarro:*  
${`${saleById.car.brand} ${saleById.car.model} ${saleById.car.color} - ${saleById.car.plate}`}\n\nServiços:* ${servicesMessage}\n\n*POR FAVOR LEMBRE-SE DE CHECKAR E MANTER O STATUS DO SERVIÇO ATUALIZADO NA PLATAFORMA*`;

            await this.wppMessagesProvider.sendMessage(formattedMessage, [
              `+55${profileById.user.telephone}`,
            ]);

            created_providers.push(createdSaleServiceProvider);
          }
        }
      }
    }
    return { created_providers };
  }
}

export default CreateSaleServiceProvidersService;
