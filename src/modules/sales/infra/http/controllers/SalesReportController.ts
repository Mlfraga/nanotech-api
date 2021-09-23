import crypto from 'crypto';
import { endOfDay, format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Request, Response } from 'express';
import fs from 'fs';
import pdf, { FileInfo } from 'html-pdf';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import getTranslatedSalesStatus from '@shared/utils/GetTranslatedSalesStatus';
import { template } from '@shared/utils/Template';

import CompanyRepository from '@modules/companies/infra/typeorm/repositories/CompanyRepository';
import CompanyPricesRepository from '@modules/company_prices/infra/typeorm/repositories/CompanyPricesRepository';
import ServiceRepository from '@modules/services/infra/typeorm/repositories/ServiceRepository';

import SaleRepository from '../../typeorm/repositories/SaleRepository';

interface IPDFError {
  name: string;
  message: string;
  stack?: string;
}

export default class SalesReportController {
  async store(request: Request, response: Response) {
    const { company, service, initialDate, finalDate, status } = request.query;

    let serviceById;

    const saleRepository = container.resolve(SaleRepository);
    const serviceRepository = container.resolve(ServiceRepository);
    const companyPricesRepository = container.resolve(CompanyPricesRepository);
    const companyRepository = container.resolve(CompanyRepository);

    if (service) {
      serviceById = await serviceRepository.findById(String(service));
    }

    const sales = await saleRepository.filter({
      status: status && String(status),
      company: company && String(company),
      service: service && String(service),
      initialDate: initialDate
        ? startOfDay(new Date(String(initialDate)))
        : undefined,
      finalDate: finalDate ? endOfDay(new Date(String(finalDate))) : undefined,
    });

    const total = {
      cost_values_amount: 0,
      company_values_amount: 0,
      balance_amount: 0,
    };

    if (!sales) {
      throw new AppError('Sales filter error');
    }

    const formattedPdfSalesPromises = sales.map(async sale => {
      const formatedServicesSales: {
        name: string;
        cost_value_service: string;
        company_price_service: string;
        balance: string;
      }[] = [];
      for (const serv of sale.services_sales) {
        const servicePriceOnCompany =
          await companyPricesRepository.findByCompanyIdAndServiceId(
            sale.seller.company?.id,
            serv.service.id,
          );

        const balance = serv.company_value - serv.cost_value;

        total.balance_amount += Number(balance);
        total.cost_values_amount += Number(serv.service.price);
        total.company_values_amount += servicePriceOnCompany
          ? Number(servicePriceOnCompany?.price)
          : 0;

        formatedServicesSales.push({
          name: serv.service.name,
          cost_value_service: Number(serv.cost_value).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }),
          company_price_service: Number(serv.company_value).toLocaleString(
            'pt-br',
            {
              style: 'currency',
              currency: 'BRL',
            },
          ),
          balance: Number(balance).toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }),
        });
      }

      const translatedStatus = getTranslatedSalesStatus(sale.status);
      return {
        number: `${sale.seller.company.client_identifier}${sale.unit.client_identifier}${sale.client_identifier}`,
        company: sale.seller.company?.name,
        unit: sale?.unit?.name || sale.seller.unit?.name,
        seller: sale.seller.name,
        car: sale.car.model,
        car_plate: sale.car.plate,
        delivery_date: format(sale.delivery_date, "dd'/'MM'/'yyyy", {
          locale: ptBR,
        }),
        cost_value: Number(sale.cost_value).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
        company_price: Number(sale.company_value).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
        status: translatedStatus,
        services: formatedServicesSales,
      };
    });

    let companyById;

    if (company) {
      companyById = await companyRepository.findById(String(company));
    }

    const formattedPdfSales = await Promise.all(formattedPdfSalesPromises);

    const html = template('ReportPDFTemplate', {
      FORMATTED_SALES: formattedPdfSales,
      COMPANY_FILTER: companyById?.name,
      PERIOD_FILTER:
        initialDate && finalDate
          ? `De ${format(
              startOfDay(new Date(initialDate.toString())),
              "dd'/'MM'/'yyyy",
              {
                locale: ptBR,
              },
            )} até ${format(
              endOfDay(new Date(finalDate.toString())),
              "dd'/'MM'/'yyyy",
              {
                locale: ptBR,
              },
            )}`
          : '',
      TODAY: format(new Date(), "dd'/'MM'/'yyyy", { locale: ptBR }),
      SERVICE_FILTER: serviceById ? serviceById.name : '',
      STATUS_FILTER: status ? getTranslatedSalesStatus(String(status)) : '',
      AMOUNT: {
        balance_amount: Number(total.balance_amount).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
        cost_values_amount: Number(total.cost_values_amount).toLocaleString(
          'pt-br',
          {
            style: 'currency',
            currency: 'BRL',
          },
        ),
        company_values_amount: Number(
          total.company_values_amount,
        ).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    });

    const fileHash = crypto.randomBytes(10).toString('hex');
    const fileName = `${fileHash}-relatorio`;

    pdf
      .create(html, {
        format: 'A4',
        border: { top: '1cm', bottom: '1cm' },
        width: '1080px',
        height: '1920px',
        orientation: 'portrait',
      })
      .toFile(
        `tmp/uploads/${fileName}.pdf`,
        // eslint-disable-next-line consistent-return
        (err: IPDFError, res: FileInfo): void => {
          if (err) return console.log(err);

          console.log(res);
        },
      );

    const TIME_TO_DESTROY = 300000;

    setTimeout(() => {
      fs.unlinkSync(`tmp/uploads/${fileName}.pdf`);
    }, TIME_TO_DESTROY);

    return response.json({
      url_to_download: `${process.env.URL}/sales/download/sales-report/${fileName}.pdf`,
      destroysIn: TIME_TO_DESTROY,
    });
  }

  async index(request: Request, response: Response) {
    const { fileName } = request.params;

    try {
      if (!fs.existsSync(`tmp/uploads/${fileName}`)) {
        return response.status(400).json('File is no longer available.');
      }

      return response.download(`tmp/uploads/${fileName}`);
    } catch (error: any) {
      return response.status(400).json(error?.message || 'erro');
    }
  }
}
