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
  finalDeliveryDate?: Date;
  sellerId?: string;
  companyId?: string;
  initialAvailabilityDate?: Date;
  finalAvailabilityDate?: Date;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
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
  }: IFiltersParams): Promise<Sale[] | undefined>;
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
  ): Promise<IPaginatedSalesResponse>;
  delete(id: string): Promise<void>;
}
