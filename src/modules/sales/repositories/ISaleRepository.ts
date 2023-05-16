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
  initialDeliveryDate?: Date;
  finalDeliveryDate?: Date;
  sellerId?: string;
  companyId?: string;
  initialAvailabilityDate?: Date;
  finalAvailabilityDate?: Date;
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
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
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
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
    }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
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
  findRewardedSalesByCommissioner(
    commissioner_id: string,
    params: IListRewardParams,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
  findRewardedSales(params: IListRewardParams): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }>;
  delete(id: string): Promise<void>;
}
