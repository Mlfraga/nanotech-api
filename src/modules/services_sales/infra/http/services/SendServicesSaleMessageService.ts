import ISaleRepository from '@modules/sales/repositories/ISaleRepository';
import IServiceSaleRepository from '@modules/services_sales/repositories/IServiceSaleRepository';
import IWppMessagesProvider from '@shared/container/providers/WppMessagesProvider/models/IWppMessagesProvider';
import AppError from '@shared/errors/AppError';
import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  saleId: string;
}

@injectable()
class SendServicesSaleMessageService {
  constructor(
    @inject('ServiceSaleRepository')
    private serviceSaleRepository: IServiceSaleRepository,

    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('WppMessagesProvider')
    private wppMessagesProvider: IWppMessagesProvider,
  ) {}

  public async execute({ saleId }: IRequest): Promise<void> {
    const saleById = await this.saleRepository.findById(saleId);

    if (!saleById) {
      throw new AppError('Sale not found.', 404);
    }

    const serviceSales = await this.serviceSaleRepository.findBySale(saleId);

    let servicesMessage = '';

    serviceSales.forEach((serv, index) => {
      if (index === 0) {
        servicesMessage += `${serv.service.name}`;
      } else {
        servicesMessage += ` | ${serv.service.name}`;
      }
    });

    const createdSaleMessageData = {
      saleNumber: `${saleById?.seller.company?.client_identifier || ''}${saleById?.unit.client_identifier}${saleById?.client_identifier}`,
      availabilityDate: format(
        addHours(new Date(String(saleById?.availability_date)), -3),
        "dd'/'MM'/'yyyy '-' HH:mm'h'",
        { locale: ptBR },
      ),
      deliveryDate: format(
        addHours(new Date(String(saleById?.delivery_date)), -3),
        "dd'/'MM'/'yyyy '-' HH:mm'h'",
        { locale: ptBR },
      ),
      requestDate: format(
        addHours(new Date(String(saleById?.request_date)), -3),
        "dd'/'MM'/'yyyy '-' HH:mm'h'",
        { locale: ptBR },
      ),
      seller: saleById?.seller.name,
      company: saleById?.seller.company?.name || '',
      unit: saleById?.unit?.name,
      car: `${saleById?.car.brand} ${saleById?.car.model} ${saleById?.car.color}, placa ${saleById?.car.plate}`,
      comments: saleById?.comments ? saleById?.comments : ' ',
    };

    const createdSaleMessage = `*Novo pedido realizado:*\n\n*n°:* ${createdSaleMessageData.saleNumber}\n\n*Data de disponibilidade:* ${createdSaleMessageData.availabilityDate}\n\n*Data de entrega:* ${createdSaleMessageData.deliveryDate}\n\n*Data do registro da venda:* ${createdSaleMessageData.requestDate}\n\n*Vendedor(a):* ${createdSaleMessageData.seller}\n\n*Concessionária:* ${createdSaleMessageData.company}\n\n*Unidade:* ${createdSaleMessageData.unit}\n\n*Carro:* ${createdSaleMessageData.car}\n\n*Serviços:*\n${servicesMessage}\n\n*Observações:* ${createdSaleMessageData.comments} `;

    const recipients: string[] = ['+553196811409'];

    for (const recipient of recipients) {
      const response = await this.wppMessagesProvider.sendMessage(
        createdSaleMessage,
        [recipient],
      );

      console.log('response: ', response);
    }
  }
}

export default SendServicesSaleMessageService;
