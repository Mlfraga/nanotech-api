import { endOfDay, startOfDay } from 'date-fns';
import {
  Between,
  Repository,
  SelectQueryBuilder,
  getRepository,
} from 'typeorm';

import ICreateSaleDTO from '@modules/sales/dtos/ICreateSaleDTO';

import ISaleRepository, {
  IListRewardParams,
} from '../../../repositories/ISaleRepository';
import Sale from '../entities/Sale';

interface IFiltersParams {
  status?: string;
  company?: string;
  service?: string;
  initialDate?: Date;
  finalDate?: Date;
}

interface IFilters {
  initialDeliveryDate?: Date;
  sellerId?: string;
  finalDeliveryDate?: Date;
  companyId?: string;
  initialAvailabilityDate?: Date;
  finalAvailabilityDate?: Date;
  startFinishedDate?: Date;
  endFinishedDate?: Date;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'FINISHED';
}

class SaleRepository implements ISaleRepository {
  private ormRepository: Repository<Sale>;

  constructor() {
    this.ormRepository = getRepository(Sale);
  }

  public async find(): Promise<Sale[] | undefined> {
    const sale = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      relations: [
        'seller',
        'seller.company',
        'unit',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
    });

    return sale;
  }

  public async filter({
    status,
    company,
    initialDate,
    finalDate,
  }: IFiltersParams): Promise<Sale[] | undefined> {
    const hasAnyFilter = status || company || (initialDate && finalDate);

    const sale = await this.ormRepository.find({
      join: { alias: 'sale', innerJoin: { seller: 'sale.seller' } },
      order: { created_at: 'ASC' },
      ...(hasAnyFilter && {
        where: (qb: SelectQueryBuilder<Sale>) => {
          const filtering = qb.where({ ...(status && { status }) });

          if (company) {
            filtering.andWhere('seller.company_id = :company', { company });
          }

          if (initialDate && finalDate) {
            filtering.andWhere('finished_at > :startDate', {
              startDate: initialDate,
            });
            filtering.andWhere('finished_at < :endDate', {
              endDate: finalDate,
            });
          }
        },
      }),
      relations: [
        'seller',
        'seller.company',
        'unit',
        'unit.company',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
    });

    return sale;
  }

  public async findByDateAndStatus(
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
  }> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await this.ormRepository.count({
      where: {
        availability_date: Between(
          availabilityDateInitialDay,
          availabilityDateFinalDay,
        ),
        delivery_date: Between(deliveryDateInitialDay, deliveryDateFinalDay),
        status,
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      where: {
        availability_date: Between(
          availabilityDateInitialDay,
          availabilityDateFinalDay,
        ),
        delivery_date: Between(deliveryDateInitialDay, deliveryDateFinalDay),
        status,
      },
      relations: [
        'seller',
        'seller.company',
        'unit',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
    });

    return {
      current_page: Number(page),
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: sales.length,
      items: sales,
    };
  }

  public async findByCompanyAndFinishedStatus(
    companyId: string,
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
      sellerId,
      startFinishedDate,
      endFinishedDate,
    }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await this.ormRepository.count({
      join: { alias: 'sale', innerJoin: { seller: 'sale.seller' } },
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where({
          ...(initialDeliveryDate &&
            finalDeliveryDate && {
              delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
            }),
          ...(initialAvailabilityDate &&
            finalAvailabilityDate && {
              availability_date: Between(
                initialAvailabilityDate,
                finalAvailabilityDate,
              ),
            }),
          ...(startFinishedDate &&
            endFinishedDate && {
              finished_at: Between(startFinishedDate, endFinishedDate),
            }),
          ...(status && { status }),
          ...(sellerId && { seller_id: sellerId }),
        }).andWhere('seller.company_id = :companyId', { companyId });
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      join: { alias: 'sale', innerJoin: { seller: 'sale.seller' } },
      relations: [
        'seller',
        'seller.company',
        'unit',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where({
          ...(initialDeliveryDate &&
            finalDeliveryDate && {
              delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
            }),
          ...(initialAvailabilityDate &&
            finalAvailabilityDate && {
              availability_date: Between(
                initialAvailabilityDate,
                finalAvailabilityDate,
              ),
            }),
          ...(startFinishedDate &&
            endFinishedDate && {
              finished_at: Between(startFinishedDate, endFinishedDate),
            }),
          ...(status && { status }),
          ...(sellerId && { seller_id: sellerId }),
        }).andWhere('seller.company_id = :companyId', { companyId });
      },
      order: { request_date: 'DESC' },
    });

    return {
      current_page: Number(page),
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: sales.length,
      items: sales,
    };
  }

  public async findAllSales(
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      startFinishedDate,
      endFinishedDate,
      companyId,
      status,
      sellerId,
    }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await this.ormRepository.count({
      join: { alias: 'sale', innerJoin: { seller: 'sale.seller' } },
      where: (qb: SelectQueryBuilder<Sale>) => {
        if (companyId) {
          qb.where({
            ...(initialDeliveryDate &&
              finalDeliveryDate && {
                delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
              }),
            ...(initialAvailabilityDate &&
              finalAvailabilityDate && {
                availability_date: Between(
                  initialAvailabilityDate,
                  finalAvailabilityDate,
                ),
              }),
            ...(startFinishedDate &&
              endFinishedDate && {
                finished_at: Between(startFinishedDate, endFinishedDate),
              }),
            ...(sellerId && { seller_id: sellerId }),
            ...(status && { status }),
          }).andWhere('seller.company_id = :companyId', { companyId });
        } else {
          qb.where({
            ...(initialDeliveryDate &&
              finalDeliveryDate && {
                delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
              }),
            ...(initialAvailabilityDate &&
              finalAvailabilityDate && {
                availability_date: Between(
                  initialAvailabilityDate,
                  finalAvailabilityDate,
                ),
              }),
            ...(startFinishedDate &&
              endFinishedDate && {
                finished_at: Between(startFinishedDate, endFinishedDate),
              }),
            ...(sellerId && { seller_id: sellerId }),
            ...(status && { status }),
          });
        }
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      join: { alias: 'sale', innerJoin: { seller: 'sale.seller' } },
      where: (qb: SelectQueryBuilder<Sale>) => {
        if (companyId) {
          qb.where({
            ...(initialDeliveryDate &&
              finalDeliveryDate && {
                delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
              }),
            ...(initialAvailabilityDate &&
              finalAvailabilityDate && {
                availability_date: Between(
                  initialAvailabilityDate,
                  finalAvailabilityDate,
                ),
              }),
            ...(startFinishedDate &&
              endFinishedDate && {
                finished_at: Between(startFinishedDate, endFinishedDate),
              }),
            ...(sellerId && { seller_id: sellerId }),
            ...(status && { status }),
          }).andWhere('seller.company_id = :companyId', { companyId });
        } else {
          qb.where({
            ...(initialDeliveryDate &&
              finalDeliveryDate && {
                delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
              }),
            ...(initialAvailabilityDate &&
              finalAvailabilityDate && {
                availability_date: Between(
                  initialAvailabilityDate,
                  finalAvailabilityDate,
                ),
              }),
            ...(startFinishedDate &&
              endFinishedDate && {
                finished_at: Between(startFinishedDate, endFinishedDate),
              }),
            ...(sellerId && { seller_id: sellerId }),
            ...(status && { status }),
          });
        }
      },
      order: { request_date: 'DESC' },
      relations: [
        'seller',
        'seller.company',
        'unit',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
    });

    return {
      current_page: Number(page),
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: sales.length,
      items: sales,
    };
  }

  public async findBySeller(
    sellerId: string,
    page: number,
    {
      initialDeliveryDate,
      finalDeliveryDate,
      initialAvailabilityDate,
      finalAvailabilityDate,
      status,
      startFinishedDate,
      endFinishedDate,
    }: IFilters,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const count = await this.ormRepository.count({
      where: {
        seller_id: sellerId,
        ...(initialDeliveryDate &&
          finalDeliveryDate && {
            delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
          }),
        ...(initialAvailabilityDate &&
          finalAvailabilityDate && {
            availability_date: Between(
              initialAvailabilityDate,
              finalAvailabilityDate,
            ),
          }),
        ...(startFinishedDate &&
          endFinishedDate && {
            finished_at: Between(startFinishedDate, endFinishedDate),
          }),
        ...(status && { status }),
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      where: {
        seller_id: sellerId,
        ...(initialDeliveryDate &&
          finalDeliveryDate && {
            delivery_date: Between(initialDeliveryDate, finalDeliveryDate),
          }),
        ...(startFinishedDate &&
          endFinishedDate && {
            finished_at: Between(startFinishedDate, endFinishedDate),
          }),
        ...(initialAvailabilityDate &&
          finalAvailabilityDate && {
            availability_date: Between(
              initialAvailabilityDate,
              finalAvailabilityDate,
            ),
          }),
        ...(status && { status }),
      },
      order: { request_date: 'DESC' },
      relations: [
        'seller',
        'seller.company',
        'unit',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
    });

    return {
      current_page: Number(page),
      total_pages: Math.floor(count / limit_per_page),
      total_items: count,
      total_items_page: sales.length,
      items: sales,
    };
  }

  public async findRewardedSalesByCommissioner(
    commissioner_id: string,
    {
      start_delivery_date,
      end_delivery_date,
      company_id,
      production_status,
      unit_id,
      seller_id,
      status,
      page,
    }: IListRewardParams,
  ): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    const salesCount = await this.ormRepository.count({
      join: {
        alias: 'sales',
        innerJoin: {
          service_sales: 'sales.services_sales',
          seller: 'sales.seller',
        },
      },
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where({
          ...(start_delivery_date &&
            end_delivery_date && {
              delivery_date: Between(start_delivery_date, end_delivery_date),
            }),
          ...(production_status && { production_status }),
          ...(unit_id && { unit_id }),
          ...(seller_id && { seller_id }),
          ...(status && { status }),
        }).andWhere('service_sales.commissioner_id = :commissioner_id', {
          commissioner_id,
        });

        if (company_id) {
          qb.andWhere('seller.company_id = :company_id', { company_id });
        }
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      join: {
        alias: 'sales',
        innerJoin: { service_sales: 'sales.services_sales' },
      },
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where({
          ...(start_delivery_date &&
            end_delivery_date && {
              delivery_date: Between(start_delivery_date, end_delivery_date),
            }),
          ...(production_status && { production_status }),
          ...(unit_id && { unit_id }),
          ...(seller_id && { seller_id }),
          ...(status && { status }),
        }).andWhere('service_sales.commissioner_id = :commissioner_id', {
          commissioner_id,
        });

        if (company_id) {
          qb.andWhere('seller.company_id = :company_id', { company_id });
        }
      },
      order: { delivery_date: 'DESC' },
      relations: [
        'services_sales',
        'seller',
        'seller.company',
        'unit',
        'unit.company',
        'person',
        'car',
        'services_sales.service',
      ],
    });

    return {
      current_page: Number(page),
      total_pages: Math.floor(salesCount / limit_per_page),
      total_items: salesCount,
      total_items_page: sales.length,
      items: sales,
    };
  }

  public async findRewardedSales({
    start_delivery_date,
    end_delivery_date,
    company_id,
    production_status,
    unit_id,
    seller_id,
    status,
    page,
  }: IListRewardParams): Promise<{
    current_page: number;
    total_pages: number;
    total_items: number;
    total_items_page: number;
    items: Sale[];
  }> {
    const limit_per_page = 10;
    const offset = page * limit_per_page;

    let formattedStartDate: Date | null = null;
    let formattedEndDate: Date | null = null;

    if (start_delivery_date && end_delivery_date) {
      formattedStartDate = startOfDay(new Date(start_delivery_date));
      formattedEndDate = endOfDay(new Date(end_delivery_date));
    }

    const salesCount = await this.ormRepository.count({
      join: {
        alias: 'sales',
        innerJoin: {
          service_sales: 'sales.services_sales',
          seller: 'sales.seller',
        },
      },
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where({
          ...(start_delivery_date &&
            end_delivery_date && {
              delivery_date: Between(start_delivery_date, end_delivery_date),
            }),
          ...(production_status && { production_status }),
          ...(unit_id && { unit_id }),
          ...(seller_id && { seller_id }),
          ...(status && { status }),
        }).andWhere('service_sales.commissioner_id is not null');

        if (company_id) {
          qb.andWhere('seller.company_id = :company_id', { company_id });
        }
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      join: {
        alias: 'sales',
        innerJoin: {
          service_sales: 'sales.services_sales',
          seller: 'sales.seller',
        },
      },
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where({
          ...(start_delivery_date &&
            end_delivery_date && {
              delivery_date: Between(formattedStartDate, formattedEndDate),
            }),
          ...(production_status && { production_status }),
          ...(unit_id && { unit_id }),
          ...(seller_id && { seller_id }),
          ...(status && { status }),
        }).andWhere('service_sales.commissioner_id is not null');

        if (company_id) {
          qb.andWhere('seller.company_id = :company_id', { company_id });
        }
      },
      order: {
        client_identifier: 'DESC',
      },
      relations: [
        'services_sales',
        'seller',
        'seller.company',
        'unit',
        'unit.company',
        'person',
        'car',
        'services_sales.service',
        // 'commissioner',
      ],
    });

    return {
      current_page: Number(page),
      total_pages: Math.floor(salesCount / limit_per_page),
      total_items: salesCount,
      total_items_page: sales.length,
      items: sales,
    };
  }

  public async findByServiceProvider(providerId: string): Promise<Sale[]> {
    const sales = await this.ormRepository.find({
      join: {
        alias: 'sales',
        innerJoin: { providers: 'sales.service_providers' },
      },
      where: (qb: SelectQueryBuilder<Sale>) => {
        qb.where('providers.service_provider_profile_id = :providerId', {
          providerId,
        });
      },
      order: { request_date: 'DESC' },
      relations: [
        'seller',
        'seller.company',
        'unit',
        'person',
        'car',
        'service_providers',
        'services_sales.service',
        'services_sales',
      ],
    });

    return sales;
  }

  public async findById(id: string): Promise<Sale | undefined> {
    const sale = await this.ormRepository.findOne(id, {
      relations: [
        'seller',
        'seller.company',
        'seller.user',
        'unit',
        'unit.company',
        'person',
        'car',
        'services_sales',
        'services_sales.service',
      ],
    });

    return sale;
  }

  public async create(data: ICreateSaleDTO): Promise<Sale> {
    const sale = this.ormRepository.create(data);

    await this.ormRepository.save(sale);

    return sale;
  }

  public async save(sale: Sale): Promise<Sale> {
    return this.ormRepository.save(sale);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default SaleRepository;
