import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import Company from '@modules/companies/infra/typeorm/entities/Company';

export enum PixKeyTypeEnum {
  CPF,
  PHONE,
  EMAIL,
  RANDOM,
}

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
  pix_key_type: string;

  @Column()
  pix_key: string;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.commissioners)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
