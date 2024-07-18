import { injectable, inject } from 'tsyringe';

import ICompanyRepository from '@modules/companies/repositories/ICompanyRepository';
import AppError from '@shared/errors/AppError';
import ISaleRepository from '@modules/sales/repositories/ISaleRepository';

interface IDashboardResponse {
  sales: {
    amount: number;
    revenue: number;
    averageSaleValue: number;
  };
  topSellingServices: {
    name: string;
    id: string;
    count: number;
  }[];
  topSellingCompanies: {
    id: string;
    name: string;
    count: number;
  }[];
  topSellingUnities: {
    id: string;
    name: string;
    count: number;
  }[];
  leadSource: string[];
}

interface IRequest {
  start_date_filter: Date;
  end_date_filter: Date;
  company_id: string;
}

@injectable()
class DashboardService {
  constructor(
    @inject('CompanyRepository')
    private companyRepository: ICompanyRepository,

    @inject('SaleRepository')
    private saleRepository: ISaleRepository,
  ) {}

  public async execute({
    start_date_filter,
    end_date_filter,
    company_id,
  }: IRequest): Promise<IDashboardResponse> {
    // const company = await this.companyRepository.findById(company_id);

    // if (!company) {
    //   throw new AppError('Company not found');
    // }

    const sales = await this.saleRepository.filter({
      initialDate: start_date_filter,
      finalDate: end_date_filter,
    });

    if (!sales.length) {
      return {
        sales: {
          amount: 0,
          revenue: 0,
          averageSaleValue: 0,
        },
        topSellingServices: [],
        topSellingCompanies: [],
        topSellingUnities: [],
        leadSource: [],
      };
    }

    const revenue = sales.reduce((total, sale) => total + sale.cost_value, 0);
    const averageSaleValue = revenue / sales.length;

    const serviceCounts = sales.reduce((acc, sale) => {
      sale.services_sales.forEach(service => {
        if (service.service?.service_group_id) {
          if (!acc[service.id]) {
            acc[service.service.service_group_id as string] = { id: service.service.service_group?.id as string, name: service.service?.service_group?.name as string, count: 0 };
          }

          acc[service.service.service_group_id as string].count += 1;
        }
      });

      return acc;
    }, {} as Record<string, { id: string; name: string; count: number }>);

    const companyCounts = sales.reduce((acc, sale) => {
      if (!acc[sale.unit.company_id]) {
        acc[sale.unit.company_id] = { id: sale.unit.company_id, name: sale.unit.company?.name ?? '', count: 0 };
      }
      acc[sale.unit.company_id].count += 1;
      return acc;
    }, {} as Record<string, { id: string; name: string; count: number }>);

    const unityCounts = sales.reduce((acc, sale) => {
      if (!acc[sale.unit.id]) {
        acc[sale.unit.id] = { id: sale.unit.id, name: sale.unit.name, count: 0 };
      }
      acc[sale.unit.id].count += 1;
      return acc;
    }, {} as Record<string, { id: string; name: string; count: number }>);

    const topSellingServices = Object.values(serviceCounts).sort((a, b) => b.count - a.count);
    const topSellingCompanies = Object.values(companyCounts).sort((a, b) => b.count - a.count);
    const topSellingUnities = Object.values(unityCounts).sort((a, b) => b.count - a.count);
    const leadSourceCounts = sales.reduce((acc, sale) => {
      if (!acc[sale.source]) {
        acc[sale.source] = { name: sale.source, count: 0 };
      }
      acc[sale.source].count += 1;
      return acc;
    }, {} as Record<string, { name: string; count: number }>);
    console.log("🚀 ~ DashboardService ~ leadSourceCounts ~ leadSourceCounts:", leadSourceCounts)

    const dashboardData: IDashboardResponse = {
      sales: {
        amount: sales.length,
        revenue,
        averageSaleValue,
      },
      topSellingServices,
      topSellingCompanies,
      topSellingUnities,
      leadSource: [],
    };

    return dashboardData;
  }
}

export default DashboardService;
