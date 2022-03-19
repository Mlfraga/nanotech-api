import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import client from 'twilio';

import AppError from '@shared/errors/AppError';

import ServiceSale from '@modules/services_sales/infra/typeorm/entities/ServiceSale';

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

        servicesNames.push(serviceById?.name);

        const data = await serviceSaleRepository.create({
          sale_id: saleId,
          service_id: id,
          company_value: serviceById.company_price,
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

    const recipients = ['whatsapp:+553192458098', 'whatsapp:+553188783666'];

    for (const recipient of recipients) {
      await client().messages.create({
        from: 'whatsapp:+14129618290',
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
