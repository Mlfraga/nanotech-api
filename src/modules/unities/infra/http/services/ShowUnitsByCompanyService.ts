import { injectable, inject } from 'tsyringe';

import IUnitRepository from '../../../repositories/IUnitRepository';
import Unit from '../../typeorm/entities/Unit';

interface IRequest {
  company_id: string;
}

@injectable()
class ShowUnitsByCompanyService {
  constructor(
    @inject('UnitRepository')
    private unitRepository: IUnitRepository,
  ) {}

  public async execute({ company_id }: IRequest): Promise<Unit[] | undefined> {
    const units = await this.unitRepository.findByCompanyId(company_id);

    return units;
  }
}

export default ShowUnitsByCompanyService;
