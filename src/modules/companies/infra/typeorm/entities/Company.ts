import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import CompanyPrices from '@modules/company_prices/infra/typeorm/entities/CompanyPrices';
import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import Service from '@modules/services/infra/typeorm/entities/Service';
import Unit from '@modules/unities/infra/typeorm/entities/Unit';
import WhatsappNumber from '@modules/whatsapp_numbers/infra/typeorm/entities/WhatsappNumber';

@Entity('companies')
export default class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cnpj: string;

  @Column()
  telephone: string;

  @OneToMany(() => Unit, unit => unit.company, { cascade: true })
  unities: Unit[];

  @OneToMany(() => Profile, profile => profile.company, {
    cascade: true,
  })
  profiles: Profile[];

  @OneToMany(() => CompanyPrices, companyPrice => companyPrice.company, {
    cascade: true,
  })
  company_prices: CompanyPrices[];

  @OneToMany(() => Service, service => service.company_id, {
    cascade: true,
  })
  company_services: Service[];

  @OneToMany(
    () => WhatsappNumber,
    whatsappNumber => whatsappNumber.company_id,
    {
      cascade: true,
    },
  )
  whatsapp_numbers: WhatsappNumber[];

  @Column()
  client_identifier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
