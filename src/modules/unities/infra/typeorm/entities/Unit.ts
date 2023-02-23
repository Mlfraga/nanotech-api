import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import Sale from '@modules/sales/infra/typeorm/entities/Sale';

import Company from '../../../../companies/infra/typeorm/entities/Company';

@Entity('unities')
export default class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  telephone: string;

  @Column()
  client_identifier: string;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.unities)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Profile, profile => profile.id, {
    cascade: true,
  })
  profiles: Profile[];

  @OneToMany(() => Sale, sale => sale.id, { cascade: true })
  sales: Sale[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
