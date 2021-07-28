import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ServiceSale from '@modules/services_sales/infra/typeorm/entities/ServiceSale';

import CompanyPricesRepository from '../../../../company_prices/infra/typeorm/repositories/CompanyPricesRepository';
import SaleRepository from '../../../../sales/infra/typeorm/repositories/SaleRepository';
import ServiceRepository from '../../../../services/infra/typeorm/repositories/ServiceRepository';
import ServiceSaleRepository from '../../typeorm/repositories/ServiceSaleRepository';

interface ICreateServiceSale {
  saleId: number;
  serviceIds: number[];
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
