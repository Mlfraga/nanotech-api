import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { inject, injectable } from 'tsyringe';

import IWppMessagesProvider from '@shared/container/providers/WppMessagesProvider/models/IWppMessagesProvider';
import AppError from '@shared/errors/AppError';

import IProfileRepository from '@modules/profiles/repositories/IProfileRepository';
import ISaleRepository from '@modules/sales/repositories/ISaleRepository';
import IServiceRepository from '@modules/services/repositories/IServiceRepository';
import IServiceSaleRepository from '@modules/services_sales/repositories/IServiceSaleRepository';
import IWhatsappNumberRepository from '@modules/whatsapp_numbers/repositories/IWhatsappNumberRepository';

import ServiceSale from '../../typeorm/entities/ServiceSale';

interface IRequest {
  isReferred: boolean;
  saleId: string;
  serviceIds: string[];
  referral_data?: {
    id: string;
    referredServices: string[];
  };
}

@injectable()
class CreateServicesSaleService {
  constructor(
    @inject('ServiceSaleRepository')
    private serviceSaleRepository: IServiceSaleRepository,

    @inject('ProfileRepository')
    private profileRepository: IProfileRepository,

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
    isReferred,
    referral_data,
  }: IRequest): Promise<ServiceSale[]> {
    const saleById = await this.saleRepository.findById(saleId);
    let commissionerByUserId;

    if (referral_data && isReferred) {
      commissionerByUserId = await this.profileRepository.findById(
        referral_data.id,
      );

      if (!commissionerByUserId || !commissionerByUserId.user) {
        throw new AppError('Commissioner not found.', 404);
      }
    }

    if (!saleById) {
      throw new AppError('Sale not found.', 404);
    }

    const referredServices: ServiceSale[] = [];

    const promises: Promise<ServiceSale>[] = serviceIds.map(
      async (id: string) => {
        const serviceById = await this.serviceRepository.findById(id);

        if (!saleById.seller.company_id) {
          throw new AppError('Company not found.', 404);
        }
        if (!serviceById) {
          throw new AppError('Service not found.', 404);
        }

        let isServiceReferred = false;

        if (referral_data) {
          isServiceReferred = referral_data.referredServices.includes(id);
        }

        const createdServiceSale = await this.serviceSaleRepository.create({
          sale_id: saleId,
          service_id: id,
          company_value: serviceById.company_price,
          cost_value: serviceById.price,
          ...(isServiceReferred &&
            referral_data && {
              commissioner_id: referral_data.id,
            }),
        });

        if (isServiceReferred) {
          console.log('createdServiceSale: ', createdServiceSale);
          referredServices.push({
            ...createdServiceSale,
            service: serviceById,
          });
        }

        return { ...createdServiceSale, service: serviceById };
      },
    );

    const servicesSales = await Promise.all<ServiceSale>(promises);

    console.log('servicesSales: ', servicesSales);

    let servicesMessage = '';

    servicesSales.forEach((serv, index) => {
      if (index === 0) {
        servicesMessage += `${serv.service.name}`;
      } else {
        servicesMessage += ` | ${serv.service.name}`;
      }
    });

    if (referral_data && commissionerByUserId) {
      let referredServicesNames = '';

      console.log('referredServices: ', referredServices);

      referredServices.forEach((serv, index) => {
        if (index === 0) {
          referredServicesNames += `${serv.service.name}`;
        } else {
          referredServicesNames += ` | ${serv.service.name}`;
        }
      });

      const commissionAmounts = referredServices.map(
        s => s.service.commission_amount || 0,
      );

      console.log(commissionAmounts);

      const totalReferralAmount = commissionAmounts.reduce(
        (accumulator, currentvalue) =>
          Number(accumulator) + Number(currentvalue),
      );

      const referralServicesMessageData = {
        commissionerName: commissionerByUserId.name,
        customerName: saleById.person.name,
        services: referredServicesNames,
        totalReferralAmount: Number(totalReferralAmount).toLocaleString(
          'pt-br',
          {
            style: 'currency',
            currency: 'BRL',
          },
        ),
        webUrl: 'https://nanotech-orpin.vercel.app/',
        companyName: 'NANOTECH CAR DETAIL',
      };

      const referralMessage = `Olá ${referralServicesMessageData.commissionerName},

É com satisfação que entramos em contato para agradecer pela sua recente indicação dos serviços: ${referralServicesMessageData.services} para o ${referralServicesMessageData.customerName}. Como forma de agradecimento, gostaríamos de oferecer uma comissão de ${referralServicesMessageData.totalReferralAmount} pela sua indicação, que será concretizada no momento da finalização do serviço. Valorizamos muito a sua confiança em nossos serviços e agradecemos a parceria que temos com você.

Além disso, queremos informar que você pode acompanhar a evolução do serviço que indicou acessando a URL ${referralServicesMessageData.webUrl}.

Atenciosamente,
${referralServicesMessageData.companyName}`;

      await this.wppMessagesProvider.sendMessage(referralMessage, [
        `+55${commissionerByUserId.user.telephone}`,
      ]);
    }

    const createdSaleMessageData = {
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

    const createdSaleMessage = `*Novo pedido realizado:*\n\n*n°:* ${createdSaleMessageData.saleNumber}\n\n*Data de disponibilidade:* ${createdSaleMessageData.availabilityDate}\n\n*Data de entrega:* ${createdSaleMessageData.deliveryDate}\n\n*Data do registro da venda:* ${createdSaleMessageData.requestDate}\n\n*Vendedor(a):* ${createdSaleMessageData.seller}\n\n*Concessionária:* ${createdSaleMessageData.company}\n\n*Unidade:* ${createdSaleMessageData.unit}\n\n*Carro:* ${createdSaleMessageData.car}\n\n*Serviços:*\n${servicesMessage}\n\n*Observações:* ${createdSaleMessageData.comments} `;

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
      await this.wppMessagesProvider.sendMessage(createdSaleMessage, [
        recipient,
      ]);
    }

    return servicesSales;
  }
}

export default CreateServicesSaleService;
