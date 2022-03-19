import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Company from '@modules/companies/infra/typeorm/entities/Company';
import ServiceSale from '@modules/services_sales/infra/typeorm/entities/ServiceSale';

@Entity('services')
export default class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  enabled: boolean;

  @Column()
  company_price: number;

  @OneToMany(() => ServiceSale, serviceSale => serviceSale.id, {
    cascade: true,
  })
  services_sales: ServiceSale[];

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.company_services)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
