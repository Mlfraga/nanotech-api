import crypto from 'crypto';
import { endOfDay, startOfDay } from 'date-fns';
import ExcelJS from 'exceljs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import getTranslatedSalesStatus from '@shared/utils/GetTranslatedSalesStatus';

import IServiceProviderRepository from '@modules/service_providers/repositories/IServiceProviderRepository';
import IUserRepository from '@modules/users/repositories/IUsersRepository';

import ISaleRepository from '../repositories/ISaleRepository';

interface IGenerateExcelReportServiceParams {
  company?: string;
  initialDate?: Date;
  finalDate?: Date;
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

    @inject('ServiceProviderRepository')
    private serviceProviderRepository: IServiceProviderRepository,

    @inject('UsersRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    company,
    initialDate,
    finalDate,
    status,
  }: IGenerateExcelReportServiceParams): Promise<IGenerateExcelReportServiceResponse> {
    const sales = await this.saleRepository.filter({
      status: status && String(status),
      company: company && String(company),
      initialDate: initialDate
        ? startOfDay(new Date(String(initialDate)))
        : undefined,
      finalDate: finalDate ? endOfDay(new Date(String(finalDate))) : undefined,
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
      { header: 'Data da venda', key: 'date', width: 15 },
      { header: 'Concesionária', key: 'company', width: 15 },
      { header: 'Serviços', key: 'services', width: 15 },
    ];

    for (const sale of sales) {
      const formattedServices = sale.services_sales
        .map(service => service.service.name)
        .join(', ');

      console.log('sale: ', sale);

      worksheet.addRow({
        id: String(sale.client_identifier),
        car: `${sale.car.brand} ${sale.car.model}`,
        cost_price: sale.cost_value,
        company_price: sale.company_value,
        seller: sale.seller.name,
        status: getTranslatedSalesStatus(sale.status),
        date: sale.created_at,
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
