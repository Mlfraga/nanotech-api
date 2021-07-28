import { getRepository, Repository } from 'typeorm';

import ICreateCompanyPricesDTO from '../../../dtos/ICreateCompanyPricesDTO';
import ICompanyPricesRepository from '../../../repositories/ICompanyPricesRepository';
import CompanyPrices from '../entities/CompanyPrices';

class CompanyPricesRepository implements ICompanyPricesRepository {
  private ormRepository: Repository<CompanyPrices>;

  constructor() {
    this.ormRepository = getRepository(CompanyPrices);
  }

  public async find(): Promise<CompanyPrices[] | undefined> {
    const companyPrices = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });

    return companyPrices;
  }

  public async findById(id: string): Promise<CompanyPrices | undefined> {
    const companyPrices = await this.ormRepository.findOne(id);

    return companyPrices;
  }

  public async findByCompanyId(
    company_id: string,
  ): Promise<CompanyPrices[] | undefined> {
    const companyPrices = await this.ormRepository.find({
      where: {
        company_id,
      },
    });

    return companyPrices;
  }

  public async findByCompanyIdAndServiceId(
    company_id: string,
    service_id: string,
  ): Promise<CompanyPrices | undefined> {
    const companyPrice = await this.ormRepository.findOne({
      where: {
        company_id,
        service_id,
      },
    });

    return companyPrice;
  }

  public async create(data: ICreateCompanyPricesDTO): Promise<CompanyPrices> {
    const companyPrices = this.ormRepository.create(data);

    await this.ormRepository.save(companyPrices);

    return companyPrices;
  }

  public async save(companyPrices: CompanyPrices): Promise<CompanyPrices> {
    return this.ormRepository.save(companyPrices);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default CompanyPricesRepository;
