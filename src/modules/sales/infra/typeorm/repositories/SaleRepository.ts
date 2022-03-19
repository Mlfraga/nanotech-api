import {
  Between,
  FindOperator,
  getRepository,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import ICreateSaleDTO from '../../../dtos/ICreateSaleDTO';
import ISaleRepository from '../../../repositories/ISaleRepository';
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
  initialAvailabilityDate?: Date;
  finalAvailabilityDate?: Date;
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
    let dueDateCriteria: FindOperator<Date> | undefined;

    if (initialDate && finalDate) {
      dueDateCriteria = Between(initialDate, finalDate);
    }

    const sale = await this.ormRepository.find({
      join: { alias: 'sale', innerJoin: { seller: 'sale.seller' } },
      order: { created_at: 'ASC' },
      where: (qb: SelectQueryBuilder<Sale>) => {
        if (company) {
          qb.where({
            ...(status && { status }),
            ...(dueDateCriteria && { delivery_date: dueDateCriteria }),
          }).andWhere('seller.company_id = :company', { company });
        } else {
          qb.where({
            ...(status && { status }),
            ...(dueDateCriteria && { delivery_date: dueDateCriteria }),
          });
        }
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
      where: {
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
        ...(sellerId && { seller_id: sellerId }),
        ...(status && { status }),
      },
    });

    const sales = await this.ormRepository.find({
      skip: offset,
      take: limit_per_page,
      where: {
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
        ...(sellerId && { seller_id: sellerId }),
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

  public async findBySeller(
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

  public async findById(id: string): Promise<Sale | undefined> {
    const sale = await this.ormRepository.findOne(id, {
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
