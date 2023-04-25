import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Sale from '@modules/sales/infra/typeorm/entities/Sale';
import SalesServiceProviders from '@modules/service_providers/infra/typeorm/entities/SaleServiceProvider';
import ServiceSale from '@modules/services_sales/infra/typeorm/entities/ServiceSale';
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

  @OneToOne(() => User, user => user.profile, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Sale, sale => sale.seller)
  sales: Sale[];

  @OneToMany(() => ServiceSale, serviceSale => serviceSale.commissioner)
  referrals: ServiceSale[];

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
