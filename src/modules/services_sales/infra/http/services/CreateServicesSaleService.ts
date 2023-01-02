import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { injectable, inject } from 'tsyringe';

import IWppMessagesProvider from '@shared/container/providers/WppMessagesProvider/models/IWppMessagesProvider';
import AppError from '@shared/errors/AppError';

import ISaleRepository from '@modules/sales/repositories/ISaleRepository';
import IServiceSaleRepository from '@modules/services_sales/repositories/IServiceSaleRepository';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';
import IWhatsappNumberRepository from '@modules/whatsapp_numbers/repositories/IWhatsappNumberRepository';

import ServiceSale from '../../typeorm/entities/ServiceSale';

interface IRequest {
  saleId: string;
  serviceIds: string[];
}

@injectable()
class CreateServicesSaleService {
  constructor(
    @inject('ServiceSaleRepository')
    private serviceSaleRepository: IServiceSaleRepository,

    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,

    @inject('SaleRepository')
    private saleRepository: ISaleRepository,

    @inject('WhatsappNumberRepository')
    private whatsappNumberRepository: IWhatsappNumberRepository,

    @inject('WppMessagesProvider')
    private wppMessagesProvider: IWppMessagesProvider,
  ) {}

  public async execute({
    saleId,
    serviceIds,
  }: IRequest): Promise<ServiceSale[]> {
    const saleById = await this.saleRepository.findById(saleId);

    if (!saleById) {
      throw new AppError('Sale not found.', 404);
    }

    const promises: Promise<ServiceSale>[] = serviceIds.map(
      async (id: string) => {
        const serviceById = await this.serviceRepository.findById(id);

        if (!saleById.seller.company_id) {
          throw new AppError('Company not found.', 404);
        }
        if (!serviceById) {
          throw new AppError('Service not found.', 404);
        }

        const createdServiceSale = await this.serviceSaleRepository.create({
          sale_id: saleId,
          service_id: id,
          company_value: serviceById.company_price,
          cost_value: serviceById.price,
        });

        return { ...createdServiceSale, service: serviceById };
      },
    );

    const servicesSales = await Promise.all<ServiceSale>(promises);

    let servicesMessage = '';

    servicesSales.forEach((serv, index) => {
      if (index === 0) {
        servicesMessage += `${serv.service.name}`;
      } else {
        servicesMessage += ` | ${serv.service.name}`;
      }
    });

    const messageData = {
      saleNumber: `${saleById?.seller.company.client_identifier}${saleById?.unit.client_identifier}${saleById?.client_identifier}`,
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
      company: saleById?.seller.company.name,
      unit: saleById?.unit?.name,
      car: `${saleById?.car.brand} ${saleById?.car.model} ${saleById?.car.color}, placa ${saleById?.car.plate}`,
      comments: saleById?.comments ? saleById?.comments : ' ',
    };

    const messageToSend = `*Novo pedido realizado:*\n\n*n°:* ${messageData.saleNumber}\n\n*Data de disponibilidade:* ${messageData.availabilityDate}\n\n*Data de entrega:* ${messageData.deliveryDate}\n\n*Data do registro da venda:* ${messageData.requestDate}\n\n*Vendedor(a):* ${messageData.seller}\n\n*Concessionária:* ${messageData.company}\n\n*Unidade:* ${messageData.unit}\n\n*Carro:* ${messageData.car}\n\n*Serviços:*\n${servicesMessage}\n\n*Observações:* ${messageData.comments} `;

    const recipients: string[] = [];

    const companyWhatsapNumbers =
      await this.whatsappNumberRepository.findByCompany(
        saleById.seller.company_id,
      );
    const globalWhatsappRecipients =
      await this.whatsappNumberRepository.findAllGlobalNumbers();

    [...companyWhatsapNumbers, ...globalWhatsappRecipients].forEach(recipient =>
      recipients.push(recipient.number),
    );

    for (const recipient of recipients) {
      await this.wppMessagesProvider.sendMessage(messageToSend, [recipient]);
    }

    return servicesSales;
  }
}

export default CreateServicesSaleService;
