import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { injectable, inject } from 'tsyringe';

import IWppMessagesProvider from '@shared/container/providers/WppMessagesProvider/models/IWppMessagesProvider';
import AppError from '@shared/errors/AppError';
import getTranslatedProductionSalesStatus from '@shared/utils/GetTranslatedSalesProductionStatus.';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';
import IWhatsappNumberRepository from '@modules/whatsapp_numbers/repositories/IWhatsappNumberRepository';

import Sale from '../infra/typeorm/entities/Sale';
import ISaleRepository from '../repositories/ISaleRepository';

interface IRequest {
  sale_ids: string[];
  status: string;
  profile_id: string;
}

@injectable()
class UpdateSaleProductionStatusService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,

    @inject('WppMessagesProvider')
    private wppMessagesProvider: IWppMessagesProvider,

    @inject('WhatsappNumberRepository')
    private whatsappNumberRepository: IWhatsappNumberRepository,
  ) {}

  public async execute({
    sale_ids,
    status,
    profile_id,
  }: IRequest): Promise<string[]> {
    const updated_sales: Sale[] = [];

    for (const sale_id of sale_ids) {
      const sale = await this.saleRepository.findById(sale_id);

      if (!sale) {
        throw new AppError('This sale was not found', 404);
      }

      const updated_sale = await this.saleRepository.save({
        ...sale,
        production_status: status,
      });

      updated_sales.push(updated_sale);
    }

    const responsibleProfile = await this.profileRepository.findById(
      profile_id,
    );

    for (const updated_sale of updated_sales) {
      const today = format(new Date(), "dd'/'MM'/'yyyy '-' HH:mm'h'", {
        locale: ptBR,
      });

      const translatedStatus = getTranslatedProductionSalesStatus(
        updated_sale.production_status,
      );

      const formattedCar = `${updated_sale.car.brand} ${updated_sale.car.model}`
        .split(' ')
        .filter((item, i, allItems) => i === allItems.indexOf(item));

      const formattedServices = updated_sale.services_sales
        .map(service => service.service.name)
        .join(', ');

      const formattedMessage = `*Pedido de Venda Atualizado:*

*n°:* ${updated_sale?.seller.company.client_identifier}${
        updated_sale?.unit.client_identifier
      }${updated_sale?.client_identifier}

*Novo status:* ${translatedStatus}

*Responsável:* ${responsibleProfile?.name}

*Data atualização:* ${today}

*Carro(a):* ${
        formattedCar.length > 2
          ? `${formattedCar[0]} ${formattedCar[1]} ${formattedCar[2]}`
          : formattedCar.join(' ')
      }

*Serviços:*

${formattedServices}

*Vendedor(a):* ${updated_sale.seller.name}

*Unidade:* ${updated_sale.unit.name}

*Observações:* ${updated_sale.comments}

Você pode encontrar mais detalhes dessa venda em nossa plataforma`;

      await this.wppMessagesProvider.sendMessage(formattedMessage, [
        `+55${updated_sale.seller.user.telephone}`,
      ]);

      const recipients: string[] = [];

      const companyWhatsapNumbers =
        await this.whatsappNumberRepository.findByCompany(
          updated_sale.seller.company_id,
        );
      const globalWhatsappRecipients =
        await this.whatsappNumberRepository.findAllGlobalNumbers();

      [...companyWhatsapNumbers, ...globalWhatsappRecipients].forEach(
        recipient => recipients.push(recipient.number),
      );

      for (const recipient of recipients) {
        await this.wppMessagesProvider.sendMessage(formattedMessage, [
          recipient,
        ]);
      }
    }

    const formatted_updated_sales = updated_sales.map(sale => sale.id);

    return formatted_updated_sales;
  }
}

export default UpdateSaleProductionStatusService;
