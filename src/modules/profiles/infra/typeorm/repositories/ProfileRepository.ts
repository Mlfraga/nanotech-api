import { getRepository, SelectQueryBuilder, Repository } from 'typeorm';

import ICreateProfileDTO from '../../../dtos/ICreateProfileDTO';
import IProfileRepository from '../../../repositories/IProfileRepository';
import Profile from '../entities/Profile';

class ProfileRepository implements IProfileRepository {
  private ormRepository: Repository<Profile>;

  constructor() {
    this.ormRepository = getRepository(Profile);
  }

  public async find(): Promise<Profile[] | undefined> {
    const profiles = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      relations: ['company', 'unit', 'user'],
    });

    return profiles;
  }

  public async findByRole(
    role?:
      | 'SELLER'
      | 'MANAGER'
      | 'ADMIN'
      | 'NANOTECH_REPRESENTATIVE'
      | 'SERVICE_PROVIDER',
  ): Promise<Profile[] | undefined> {
    const profiles = await this.ormRepository.find({
      join: { alias: 'profile', innerJoin: { user: 'profile.user' } },
      ...(role && {
        where: (qb: SelectQueryBuilder<Profile>) => {
          qb.where('user.role = :role', {
            role,
          });
        },
      }),
      order: { created_at: 'ASC' },
      relations: ['company', 'unit', 'user'],
    });

    return profiles;
  }

  public async findByUser(user_id: string): Promise<Profile | undefined> {
    const profile = await this.ormRepository.findOne({
      order: { created_at: 'ASC' },
      relations: ['company', 'unit', 'user', 'sales'],
      where: {
        user_id,
      },
    });

    return profile;
  }

  public async findByUnitId(unitId: string): Promise<Profile[] | undefined> {
    const profiles = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      relations: ['company', 'unit', 'user', 'sales'],
      where: {
        unit_id: unitId,
      },
    });

    return profiles;
  }

  public async findByCompanyId(
    companyId: string,
  ): Promise<Profile[] | undefined> {
    const profiles = await this.ormRepository.find({
      order: { created_at: 'ASC' },
      relations: ['company', 'unit', 'user'],
      where: {
        company_id: companyId,
      },
    });

    return profiles;
  }

  public async findById(id: string): Promise<Profile | undefined> {
    const profile = await this.ormRepository.findOne(id, {
      relations: ['company', 'unit', 'user'],
    });

    return profile;
  }

  public async create(data: ICreateProfileDTO): Promise<Profile> {
    const profile = this.ormRepository.create(data);

    await this.ormRepository.save(profile);

    return profile;
  }

  public async save(profile: Profile): Promise<Profile> {
    return this.ormRepository.save(profile);
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete(id);
  }
}

export default ProfileRepository;
