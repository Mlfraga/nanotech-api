import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import CompanyPrices from '@modules/company_prices/infra/typeorm/entities/CompanyPrices';
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

  @OneToMany(() => ServiceSale, serviceSale => serviceSale.id, {
    cascade: true,
  })
  services_sales: ServiceSale[];

  @OneToMany(() => CompanyPrices, companyPrices => companyPrices.id, {
    cascade: true,
  })
  company_prices: CompanyPrices[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
