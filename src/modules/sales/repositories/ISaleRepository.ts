import ICreateSaleDTO from '../dtos/ICreateSaleDTO';
import Sale from '../infra/typeorm/entities/Sale';

interface IFiltersParams {
  status?: string;
  company?: string;
  service?: string;
  initialDate?: Date;
  finalDate?: Date;
}

interface IFilters {
  initialDay?: Date;
  endDay?: Date;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
}

export default interface ISaleRepository {
  find(): Promise<Sale[] | undefined>;
  findById(id: string): Promise<Sale | undefined>;
  create(data: ICreateSaleDTO): Promise<Sale>;
  save(unit: Sale): Promise<Sale>;
  filter({
    status,
    company,
    initialDate,
    finalDate,
  }: IFiltersParams): Promise<Sale[] | undefined>;
  findByCompanyAndFinishedStatus(
    companyId: string,
    page: number,
    { initialDay, endDay, status }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
  findAllSales(
    page: number,
    { initialDay, endDay, status }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
  findBySeller(
    sellerId: string,
    page: number,
    { initialDay, endDay, status }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
  findByDateAndStatus(
    page: number,
    initialDate: Date,
    finalDate: Date,
    status: string,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
  delete(id: string): Promise<void>;
}
