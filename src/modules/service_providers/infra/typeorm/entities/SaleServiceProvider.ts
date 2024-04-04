import {
    Column, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';
import Sale from '@modules/sales/infra/typeorm/entities/Sale';

@Entity('sales_service_providers')
export default class SalesServiceProviders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sale_id: string;

  @Column()
  service_provider_profile_id: string;

  @Column()
  date_to_be_done: Date;

  @ManyToOne(() => Sale, sale => sale.service_providers)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Profile, profile => profile.services_to_provide)
  @JoinColumn({ name: 'service_provider_profile_id' })
  provider: Profile;
}
