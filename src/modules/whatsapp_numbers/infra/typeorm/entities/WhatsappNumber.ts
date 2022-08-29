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

@Entity('whatsapp_numbers')
export default class WhatsappNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  restricted_to_especific_company: boolean;

  @Column()
  company_id?: string;

  @ManyToOne(() => Company, company => company.whatsapp_numbers)
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
