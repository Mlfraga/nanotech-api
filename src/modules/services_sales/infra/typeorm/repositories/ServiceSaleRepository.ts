import { Between, getRepository, Repository } from 'typeorm';
import ICreateServiceSaleDTO from '../../../dtos/ICreateServiceSaleDTO';
import IServiceSaleRepository from '../../../repositories/IServiceSaleRepository';
import ServiceSale from '../entities/ServiceSale';

class ServiceSaleRepository implements IServiceSaleRepository {
  private ormRepository: Repository<ServiceSale>;

  constructor() {
    this.ormRepository = getRepository(ServiceSale);
  }

  public async find(): Promise<ServiceSale[] | undefined> {
    const serviceSale = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });

    return serviceSale;
  }

  public async findBySale(saleId: string): Promise<ServiceSale[]> {
    const serviceSales = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      where: {
        sale_id: saleId,
      },
    });

    return serviceSales;
  }

  public async filter(
    serviceId: string,
    companyId: string,
    unitId: string,
    startDeliveryDate: Date,
    endDeliveryDate: Date,
  ): Promise<ServiceSale[]> {
    const serviceSales = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      where: {
        service_id: serviceId,
        sale: {
          deliveryDate: Between(startDeliveryDate, endDeliveryDate),
          seller: {
            company_id: companyId,
            unit_id: unitId,
          },
        },
      },
    });

    return serviceSales;
  }

  public async findById(id: string): Promise<ServiceSale | undefined> {
    const serviceSale = await this.ormRepository.findOne(id);

    return serviceSale;
  }

  public async create(data: ICreateServiceSaleDTO): Promise<ServiceSale> {
    const serviceSale = this.ormRepository.create(data);

    await this.ormRepository.save(serviceSale);

    return serviceSale;
  }

  public async save(serviceSale: ServiceSale): Promise<ServiceSale> {
    return this.ormRepository.save(serviceSale);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default ServiceSaleRepository;
