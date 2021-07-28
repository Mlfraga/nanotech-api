import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Company from '@modules/companies/infra/typeorm/entities/Company';
import Service from '@modules/services/infra/typeorm/entities/Service';

@Entity('company_prices')
export default class CompanyPrices {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  price: number;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.company_prices)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  service_id: string;

  @ManyToOne(() => Service, service => service.company_prices, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
