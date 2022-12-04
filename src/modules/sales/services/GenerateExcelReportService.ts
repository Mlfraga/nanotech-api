import crypto from 'crypto';
import { endOfDay, startOfDay, isAfter } from 'date-fns';
import ExcelJS from 'exceljs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import getTranslatedSalesStatus from '@shared/utils/GetTranslatedSalesStatus';

import ISaleRepository from '../repositories/ISaleRepository';

interface IGenerateExcelReportServiceParams {
  startRangeFinishedDate?: Date;
  endRangeFinishedDate?: Date;
  company?: string;
  status?: string;
}

interface IGenerateExcelReportServiceResponse {
  url_to_download: string;
  destroysIn: number;
}

@injectable()
class GenerateExcelReportService {
  constructor(
    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({
    company,
    startRangeFinishedDate,
    endRangeFinishedDate,
    status,
  }: IGenerateExcelReportServiceParams): Promise<IGenerateExcelReportServiceResponse> {
    const sales = await this.saleRepository.filter({
      status: status && String(status),
      company: company && String(company),
      initialDate: startRangeFinishedDate
        ? startOfDay(new Date(String(startRangeFinishedDate)))
        : undefined,
      finalDate: endRangeFinishedDate
        ? endOfDay(new Date(String(endRangeFinishedDate)))
        : undefined,
    });

    if (!sales) {
      throw new AppError('Sales not found.', 404);
    }

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('My Sheet', {
      properties: { tabColor: { argb: 'FFC0000' } },
    });

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 10 },
      { header: 'Carro', key: 'car', width: 32 },
      { header: 'Preço Nanotech', key: 'cost_price', width: 15 },
      { header: 'Preço Concessionária', key: 'company_price', width: 15 },
      { header: 'Vendedor', key: 'seller', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Data de faturamento', key: 'finished_date', width: 15 },
      { header: 'Data da venda', key: 'date', width: 15 },
      { header: 'Concesionária', key: 'company', width: 15 },
      { header: 'Serviços', key: 'services', width: 15 },
    ];

    console.log('worksheet.getColumn(3): ', worksheet.getColumn(3));

    worksheet.getColumn(3).numFmt = '$#,##0.00';
    worksheet.getColumn(4).numFmt = '$#,##0.00';

    const formattedSales = sales.sort((a, b) => {
      if (!a.finished_at || !b.finished_at) {
        return 1;
      }

      if (isAfter(b.finished_at, a.finished_at)) {
        return -1;
      }
      if (isAfter(a.finished_at, b.finished_at)) {
        return 1;
      }

      return 0;
    });

    for (const sale of formattedSales) {
      const formattedServices = sale.services_sales
        .map(service => service.service.name)
        .join(', ');

      console.log('company_price', sale.company_value);
      console.log('cost_price', sale.cost_value);

      worksheet.addRow({
        id: String(sale.client_identifier),
        car: `${sale.car.brand} ${sale.car.model}`,
        cost_price: sale.cost_value,
        company_price: sale.company_value,
        seller: sale.seller.name,
        status: getTranslatedSalesStatus(sale.status),
        date: sale.created_at,
        finished_date: sale.finished_at,
        company: `${sale.unit.company.name} ${sale.unit.name}`,
        services: formattedServices,
      });
    }

    const fileHash = crypto.randomBytes(10).toString('hex');

    const excelfile = `tmp/uploads/excel-${fileHash}.xlsx`;

    await workbook.xlsx.writeFile(excelfile);

    const destroysIn = 30000;

    return {
      url_to_download: `${process.env.URL}/sales/download/sales-report/excel-${fileHash}.xlsx`,
      destroysIn,
    };
  }
}

export default GenerateExcelReportService;
