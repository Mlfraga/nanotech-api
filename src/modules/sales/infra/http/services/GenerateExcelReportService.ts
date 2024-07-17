import crypto from 'crypto';
import { endOfDay, isAfter, startOfDay } from 'date-fns';
import ExcelJS from 'exceljs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import getTranslatedSalesStatus from '@shared/utils/GetTranslatedSalesStatus';

import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ISaleRepository from '../../../repositories/ISaleRepository';

interface IGenerateExcelReportServiceParams {
  startRangeFinishedDate?: Date;
  endRangeFinishedDate?: Date;
  company?: string;
  status?: string;
  user_id: string;
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

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    company,
    startRangeFinishedDate,
    endRangeFinishedDate,
    status,
    user_id,
  }: IGenerateExcelReportServiceParams): Promise<IGenerateExcelReportServiceResponse> {
    const user = await this.userRepository.findById(user_id);

    const sales = await this.saleRepository.filter({
      status: status && String(status),
      company:
        user?.role === 'MANAGER'
          ? user.profile?.company_id
          : company && String(company),
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
      { header: 'Vendedor', key: 'seller', width: 40 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Data de faturamento', key: 'finished_date', width: 20 },
      { header: 'Data da venda', key: 'date', width: 15 },
      { header: 'Concesionária', key: 'company', width: 50 },
      { header: 'Serviços', key: 'services', width: 150 },
    ];

    worksheet.getColumn(3).numFmt = 'R$#,##0.00';
    worksheet.getColumn(4).numFmt = 'R$#,##0.00';

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

      worksheet.addRow({
        id: String(sale.client_identifier),
        car: `${sale.car.brand} ${sale.car.model}`,
        cost_price: +sale.cost_value,
        company_price: +sale.company_value,
        seller: sale.seller.name,
        status: getTranslatedSalesStatus(sale.status),
        date: sale.created_at,
        finished_date: sale.finished_at,
        company: `${sale.unit.company?.name} ${sale.unit.name}`,
        services: formattedServices,
      });
    }

    // worksheet.columns.forEach(col => {
    //   if (col === undefined) {
    //     return;
    //   }

    //   col.eachCell(cell => {
    //     cell.value = cell?.value ? +cell?.value : 0;
    //   });
    // });

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
