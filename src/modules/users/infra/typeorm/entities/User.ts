import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import Profile from '@modules/profiles/infra/typeorm/entities/Profile';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  telephone: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  role:
    | 'SELLER'
    | 'MANAGER'
    | 'ADMIN'
    | 'NANOTECH_REPRESENTATIVE'
    | 'SERVICE_PROVIDER';

  @Column()
  first_login: boolean;

  @Column()
  enabled: boolean;

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}
