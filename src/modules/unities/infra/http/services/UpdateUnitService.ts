import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUnitRepository from '../../../repositories/IUnitRepository';
import { Unit } from '../../entities/Unit';

interface IUpdateUnitServiceParams {
  id: string;
  name: string;
  telephone: string;
  client_identifier: string;
}

@injectable()
class UpdateUnitService {
  constructor(
    @inject('UnitRepository')
    private unitRepository: IUnitRepository,
  ) {}

  public async execute({
    id,
    name,
    telephone,
    client_identifier,
  }: IUpdateUnitServiceParams): Promise<Unit> {
    const unitById = await this.unitRepository.findById(String(id));

    if (!unitById) {
      throw new AppError('Does not exist a unit with this id.');
    }

    unitById.telephone = telephone;
    unitById.name = name;
    unitById.client_identifier = client_identifier;

    const unit = await this.unitRepository.save(unitById);

    return unit;
  }
}

export default UpdateUnitService;
