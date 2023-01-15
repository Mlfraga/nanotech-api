import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import Person from '@modules/persons/infra/typeorm/entities/Person';
import Sale from '@modules/sales/infra/typeorm/entities/Sale';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  plate: string;

  @Column()
  color: string;

  @Column()
  person_id: string;

  @ManyToOne(() => Person, person => person.cars)
  @JoinColumn({ name: 'person_id' })
  person: Person;

  @OneToMany(() => Sale, sale => sale.car, { cascade: true })
  sales: Sale[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
