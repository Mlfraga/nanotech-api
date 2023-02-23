import {
    Column,
    CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import Sale from '@modules/sales/infra/typeorm/entities/Sale';

@Entity('persons')
export default class Person {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cpf: string;

  @Column()
  name: string;

  @OneToMany(() => Car, car => car.person)
  cars: Car[];

  @OneToMany(() => Sale, sale => sale.seller)
  sales: Sale[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
