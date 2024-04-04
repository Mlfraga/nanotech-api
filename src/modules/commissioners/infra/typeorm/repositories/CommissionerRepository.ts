import { getRepository, Repository } from 'typeorm';

import ICreateCommissionerDTO from '../../../dtos/ICreateCommissionerDTO';
import ICommissionerRepository from '../../../repositories/ICommissionerRepository';
import Commissioner from '../entities/Commissioner';

class CommissionerRepository implements ICommissionerRepository {
  private ormRepository: Repository<Commissioner>;

  constructor() {
    this.ormRepository = getRepository(Commissioner);
  }

  public async find(): Promise<Commissioner[]> {
    const commissioners = await this.ormRepository.find({});

    return commissioners;
  }

  public async findById(id: string): Promise<Commissioner | undefined> {
    const commissioner = await this.ormRepository.findOne(id);

    return commissioner;
  }

  public async findByCompany(company_id: string): Promise<Commissioner[]> {
    const commissioners = await this.ormRepository.find({
      where: { company_id },
    });

    return commissioners;
  };

  public async create(data: ICreateCommissionerDTO): Promise<Commissioner> {
    const commissioner = this.ormRepository.create(data);

    await this.ormRepository.save(commissioner);

    return commissioner;
  }

  public async save(commisioner: Commissioner): Promise<Commissioner> {
    return this.ormRepository.save(commisioner);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default CommissionerRepository;
