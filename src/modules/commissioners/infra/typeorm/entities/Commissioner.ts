import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import Company from '@modules/companies/infra/typeorm/entities/Company';

@Entity('commissioners')
export default class Commissioner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  telephone: string;

  @Column()
  enabled: boolean;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.commissioners)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
