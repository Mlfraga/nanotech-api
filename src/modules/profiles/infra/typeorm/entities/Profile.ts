import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import Sale from '@modules/sales/infra/typeorm/entities/Sale';
import SalesServiceProviders from '@modules/service_providers/infra/typeorm/entities/SaleServiceProvider';
import Unit from '@modules/unities/infra/typeorm/entities/Unit';
import User from '@modules/users/infra/typeorm/entities/User';

import Company from '../../../../companies/infra/typeorm/entities/Company';

@Entity('profiles')
export default class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  company_id: string;

  @Column()
  unit_id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => Company, company => company.profiles)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Unit, unit => unit.profiles)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Sale, sale => sale.seller)
  sales: Sale[];

  @OneToMany(
    () => SalesServiceProviders,
    salesServiceProviders => salesServiceProviders.provider,
  )
  services_to_provide: SalesServiceProviders[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}
