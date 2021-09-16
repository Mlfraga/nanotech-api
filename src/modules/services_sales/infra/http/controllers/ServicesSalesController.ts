import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import client from 'twilio';

import AppError from '@shared/errors/AppError';

import ServiceSale from '@modules/services_sales/infra/typeorm/entities/ServiceSale';

import CompanyPricesRepository from '../../../../company_prices/infra/typeorm/repositories/CompanyPricesRepository';
import SaleRepository from '../../../../sales/infra/typeorm/repositories/SaleRepository';
import ServiceRepository from '../../../../services/infra/typeorm/repositories/ServiceRepository';
import ServiceSaleRepository from '../../typeorm/repositories/ServiceSaleRepository';

interface ICreateServiceSale {
  saleId: number;
  serviceIds: number[];
  service: {
    name: string;
  };
}

export default class ServicesSalesController {
  async store(request: Request, response: Response) {
    const serviceSaleRepository = container.resolve(ServiceSaleRepository);
    const serviceRepository = container.resolve(ServiceRepository);
    const saleRepository = container.resolve(SaleRepository);
    const companyPricesRepository = container.resolve(CompanyPricesRepository);

    const { saleId, serviceIds } = request.body;

    const saleById = await saleRepository.findById(saleId);

    const serviceSales: ServiceSale[] = [];
    const servicesNames: string[] = [];

    if (!saleById) {
      throw new AppError('Sale not found.', 404);
    }

    const promises: Promise<ICreateServiceSale>[] = serviceIds.map(
      async (id: string) => {
        const serviceById = await serviceRepository.findById(id);

        if (!saleById.seller.company_id) {
          throw new AppError('Company not found.', 404);
        }
        if (!serviceById) {
          throw new AppError('Service not found.', 404);
        }

        const companyService =
          await companyPricesRepository.findByCompanyIdAndServiceId(
            saleById.seller.company_id,
            serviceById.id,
          );

        servicesNames.push(serviceById?.name);

        const data = await serviceSaleRepository.create({
          sale_id: saleId,
          service_id: id,
          company_value: companyService?.price ? companyService?.price : 0,
          cost_value: serviceById.price,
        });

        if (!data) {
          return null;
        }

        serviceSales.push(data);

        const serviceSale = await serviceSaleRepository.findById(data.id);

        return serviceSale;
      },
    );

    const servicesSales = await Promise.all<ICreateServiceSale>(promises);

    let servicesMessage = '';

    servicesSales.forEach((serv, index) => {
      if (index === 0) {
        servicesMessage += `${serv.service.name}`;
      } else {
        servicesMessage += ` ${serv.service.name}`;
      }
    });

    const messageToSend = `*Novo pedido realizado:*\n\n*n°:* ${`${saleById?.seller.company.client_identifier}${saleById?.unit.client_identifier}${saleById?.client_identifier}`}\n\n*Data de disponibilidade:* ${format(
      new Date(String(saleById?.availability_date)),
      "dd'/'MM'/'yyyy '-' HH:mm'h'",
      { locale: ptBR },
    )}\n\n*Data de entrega:* ${format(
      new Date(String(saleById?.delivery_date)),
      "dd'/'MM'/'yyyy '-' HH:mm'h'",
      { locale: ptBR },
    )}\n\n*Data do registro da venda:* ${format(
      new Date(String(saleById?.request_date)),
      "dd'/'MM'/'yyyy '-' HH:mm'h'",
      { locale: ptBR },
    )}\n\n*Vendedor(a):* ${saleById?.seller.name}\n\n*Concessionária:* ${
      saleById?.seller.company.name
    }\n\n*Unidade:* ${saleById?.unit?.name}\n\n*Carro:* ${
      saleById?.car.brand
    } ${saleById?.car.model} ${saleById?.car.color}, placa ${
      saleById?.car.plate
    }\n\n*Serviços:*\n${servicesMessage}\n\n*Observações:* ${
      saleById?.comments ? saleById?.comments : ''
    }`;

    const recipients = ['whatsapp:+553192458098', 'whatsapp:+553188783666'];

    for (const recipient of recipients) {
      await client().messages.create({
        from: 'whatsapp:+14155238886',
        body: messageToSend,
        to: recipient,
      });
    }
    return response.json(servicesSales);
  }

  async index(request: Request, response: Response) {
    const serviceSaleRepository = container.resolve(ServiceSaleRepository);

    const serviceSales = await serviceSaleRepository.find();

    return response.json(serviceSales);
  }

  async filter(request: Request, response: Response) {
    const { serviceId, companyId, unitId, startDeliveryDate, endDeliveryDate } =
      request.query;

    const serviceSaleRepository = container.resolve(ServiceSaleRepository);

    const filteredSales = await serviceSaleRepository.filter(
      String(serviceId),
      String(companyId),
      String(unitId),
      new Date(String(startDeliveryDate)),
      new Date(String(endDeliveryDate)),
    );

    return response.json(filteredSales);
  }
}
