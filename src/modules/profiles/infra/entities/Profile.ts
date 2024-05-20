import { Company } from '@modules/companies/infra/entities/Company';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { User } from '@modules/users/infra/entities/User';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface ProfileProps {
  name: string;
  company_id?: string;
  company?: Company;
  user_id: string;
  user?: User;
  unit_id?: string;
  unit?: Unit;
  updated_at: Date;
  created_at: Date;
}

export class Profile {
  private _id: string;
  private props: ProfileProps;

  constructor(
    props: Replace<ProfileProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string{
    return this._id;
  }

  public get name(): string{
    return this.props.name;
  }

  public set name(name: string){
    this.props.name = name;
  }

  public get company_id(): string | undefined{
    return this.props.company_id;
  }

  public set company_id(company_id: string | undefined){
    this.props.company_id = company_id;
  }

  public get company(): Company | undefined{
    return this.props.company;
  }

  public set company(company: Company | undefined){
    this.props.company = company;
  }

  public get user_id(): string{
    return this.props.user_id;
  }

  public set user_id(user_id: string){
    this.props.user_id = user_id;
  }

  public get user(): User | undefined {
    return this.props.user;
  }

  public set user(user: User | undefined){
    this.props.user = user;
  }

  public get unit_id(): string | undefined{
    return this.props.unit_id;
  }

  public set unit_id(unit_id: string | undefined){
    this.props.unit_id = unit_id;
  }

  public get unit(): Unit| undefined{
    return this.props.unit;
  }

  public set unit(unit: Unit| undefined){
    this.props.unit = unit;
  }

  public get updated_at(): Date{
    return this.props.updated_at;
  }

  public set updated_at(updated_at: Date){
    this.props.updated_at = updated_at;
  }

  public get created_at(): Date{
    return this.props.created_at;
  }

  public set created_at(created_at: Date){
    this.props.created_at = created_at;
  }
}
