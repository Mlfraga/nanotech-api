import ICreateSaleDTO from '../dtos/ICreateSaleDTO';
import { Sale } from '../infra/entities/Sale';

export interface IFiltersParams {
  status?: string;
  company?: string;
  service?: string;
  initialDate?: Date;
  finalDate?: Date;
}

export interface IPaginatedSalesResponse {
  current_page: number;
  total_pages: number;
  total_items: number;
  total_items_page: number;
  items: Sale[];
};

export interface IFilters {
  initialDeliveryDate?: Date;
  plate?: string;
  sellerId?: string;
  finalDeliveryDate?: Date;
  companyId?: string;
  initialAvailabilityDate?: Date;
  finalAvailabilityDate?: Date;
  startFinishedDate?: Date;
  endFinishedDate?: Date;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
}

export interface IListRewardParams {
  end_delivery_date?: Date;
  start_delivery_date?: Date;
  company_id?: string;
  production_status?: string;
  unit_id?: string;
  status?: string;
  seller_id?: string;
  page: number;
}

export default interface ISaleRepository {
  find(): Promise<Sale[] | undefined>;
  findById(id: string): Promise<Sale | undefined>;
  create(data: ICreateSaleDTO): Promise<Sale>;
  save(sale: Sale): Promise<Sale>;
  filter({
    status,
    company,
    initialDate,
    finalDate,
  }: IFiltersParams): Promise<Sale[]>;
  findByServiceProvider(providerId: string): Promise<Sale[]>;
  findByCompanyAndFinishedStatus(
    companyId: string,
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
    }: IFilters,
  ): Promise<IPaginatedSalesResponse>;
  findAllSales(
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
      plate,
      sellerId,
    }: IFilters,
  ): Promise<IPaginatedSalesResponse>;
  findBySeller(
    sellerId: string,
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
    }: IFilters,
  ): Promise<IPaginatedSalesResponse>;
  findByDateAndStatus(
    page: number,
    deliveryDateInitialDay: Date,
    deliveryDateFinalDay: Date,
    availabilityDateInitialDay: Date,
    availabilityDateFinalDay: Date,
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
