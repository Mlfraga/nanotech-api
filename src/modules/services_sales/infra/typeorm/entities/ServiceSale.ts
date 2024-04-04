import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import Sale from '@modules/sales/infra/typeorm/entities/Sale';
import Service from '@modules/services/infra/typeorm/entities/Service';

@Entity('services_sales')
export default class ServiceSale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  company_value: number;

  @Column()
  cost_value: number;

  @Column()
  sale_id: string;

  @ManyToOne(() => Sale, sale => sale.services_sales)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column()
  service_id: string;

  @ManyToOne(() => Service, service => service.services_sales, { eager: true })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column()
  commissioner_id: string;

  @ManyToOne(() => Profile, profile => profile.referrals, { eager: true })
  @JoinColumn({ name: 'commissioner_id' })
  commissioner: Profile;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
