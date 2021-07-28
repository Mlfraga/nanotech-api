import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import CompanyPrices from '@modules/company_prices/infra/typeorm/entities/CompanyPrices';
import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import Unit from '@modules/unities/infra/typeorm/entities/Unit';

@Entity('companies')
export default class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column()
  telephone: string;

  @OneToMany(() => Unit, unit => unit.company, { cascade: true })
  unities: Unit[];

  @OneToMany(() => Profile, profile => profile.company, {
    cascade: true,
  })
  profiles: Profile[];

  @OneToMany(() => CompanyPrices, companyPrice => companyPrice.company, {
    cascade: true,
  })
  company_prices: CompanyPrices[];

  @Column()
  client_identifier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
