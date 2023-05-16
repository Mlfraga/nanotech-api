import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import Person from '@modules/persons/infra/typeorm/entities/Person';
import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import SalesServiceProviders from '@modules/service_providers/infra/typeorm/entities/SaleServiceProvider';
import ServiceSale from '@modules/services_sales/infra/typeorm/entities/ServiceSale';
import Unit from '@modules/unities/infra/typeorm/entities/Unit';

// eslint-disable-next-line no-shadow
export enum ProductionStatusEnum {
  TO_DO,
  IN_PROGRESS,
  DONE,
  PENDING,
}
@Entity('sales')
export default class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  client_identifier: number;

  @Column()
  request_date: Date;

  @Column()
  availability_date: Date;

  @Column()
  delivery_date: Date;

  @Column()
  status: string;

  @Column()
  production_status: string;

  @Column()
  company_value: number;

  @Column()
  cost_value: number;

  @Column()
  source: string;

  @Column()
  comments: string;

  @Column()
  techinical_comments: string;

  @Column()
  seller_id: string;

  @ManyToOne(() => Profile, profile => profile.sales)
  @JoinColumn({ name: 'seller_id' })
  seller: Profile;

  @Column()
  unit_id: string;

  @ManyToOne(() => Unit, unit => unit.sales)
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @Column()
  person_id: string;

  @ManyToOne(() => Person, person => person.sales)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @Column()
  car_id: string;

  @ManyToOne(() => Car, car => car.sales)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @OneToMany(() => ServiceSale, serviceSale => serviceSale.sale, {
    cascade: true,
  })
  services_sales: ServiceSale[];

  @OneToMany(
    () => SalesServiceProviders,
    salesServiceProviders => salesServiceProviders.sale,
    {
      cascade: true,
    },
  )
  service_providers: SalesServiceProviders[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  finished_at?: Date;
}
