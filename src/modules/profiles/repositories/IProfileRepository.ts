import ICreateProfileDTO from '../dtos/ICreateProfileDTO';
import { Profile } from '../infra/entities/Profile';

export default interface IProfileRepository {
  find(): Promise<Profile[] | undefined>;
  findById(id: string): Promise<Profile | undefined>;
  findByRole(
    role?:
      | 'SELLER'
      | 'MANAGER'
      | 'ADMIN'
      | 'NANOTECH_REPRESENTATIVE'
      | 'SERVICE_PROVIDER',
    showDisabled?: boolean,
  ): Promise<Profile[]>;
  findByUser(user_id: string): Promise<Profile | undefined>;
  findByUnitId(unitId: string): Promise<Profile[]>;
  findByCompanyId(companyId: string): Promise<Profile[]>;
  create(data: ICreateProfileDTO): Promise<Profile>;
  save(profile: Profile): Promise<Profile>;
  delete(id: string): Promise<void>;
}
