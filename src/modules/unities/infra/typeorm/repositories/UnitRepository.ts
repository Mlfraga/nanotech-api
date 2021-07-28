import { getRepository, Repository } from 'typeorm';

import ICreateUnitDTO from '../../../dtos/ICreateUnitDTO';
import IUnitRepository from '../../../repositories/IUnitRepository';
import Unit from '../entities/Unit';

class UnitRepository implements IUnitRepository {
  private ormRepository: Repository<Unit>;

  constructor() {
    this.ormRepository = getRepository(Unit);
  }

  public async find(): Promise<Unit[] | undefined> {
    const unit = await this.ormRepository.find({
      order: { created_at: 'ASC' },
    });

    return unit;
  }

  public async findById(id: string): Promise<Unit | undefined> {
    const unit = await this.ormRepository.findOne(id);

    return unit;
  }

  public async findByCompanyId(companyid: string): Promise<Unit[] | undefined> {
    const units = await this.ormRepository.find({
      where: { company_id: companyid },
    });

    return units;
  }

  public async findByNameAndCompany(
    companyid: string,
    name: string,
  ): Promise<Unit[] | undefined> {
    const units = await this.ormRepository.find({
      where: { company_id: companyid, name },
    });

    return units;
  }

  public async create(data: ICreateUnitDTO): Promise<Unit> {
    const unit = this.ormRepository.create(data);

    await this.ormRepository.save(unit);

    return unit;
  }

  public async save(unit: Unit): Promise<Unit> {
    return this.ormRepository.save(unit);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default UnitRepository;
