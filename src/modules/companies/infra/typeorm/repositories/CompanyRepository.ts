import { getRepository, Repository } from 'typeorm';

import ICreateCompanyDTO from '../../../dtos/ICreateCompanyDTO';
import ICompanyRepository from '../../../repositories/ICompanyRepository';
import Company from '../entities/Company';

class CompanyRepository implements ICompanyRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async find(): Promise<Company[]> {
    const companies = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      relations: ['profiles', 'unities', 'company_prices', 'profiles.user'],
    });

    return companies;
  }

  public async findById(id: string): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne(id, {
      relations: ['profiles', 'unities', 'company_prices'],
    });

    return company;
  }

  public async findByName(name: string): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne({ where: { name } });

    return company;
  }

  public async findByCnpj(cnpj: string): Promise<Company | undefined> {
    const company = await this.ormRepository.findOne({ where: { cnpj } });

    return company;
  }

  public async create(data: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create(data);

    await this.ormRepository.save(company);

    return company;
  }

  public async save(company: Company): Promise<Company> {
    return this.ormRepository.save(company);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default CompanyRepository;
