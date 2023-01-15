import { Company } from '@modules/companies/infra/entities/Company';
import { Profile } from '@modules/profiles/infra/entities/Profile';
import { Sale } from '@modules/sales/infra/entities/Sale';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface UnitProps {
  name: string;
  telephone: string;
  client_identifier: string
  company_id: string;
  company?: Company;
  profiles?: Profile[];
  sales?: Sale[];
  created_at: Date;
  updated_at: Date;
}

export class Unit {
  private _id: string;
  private props: UnitProps;

  constructor(
    props: Replace<UnitProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string){
    this.props.name = name;
  }

  public get telephone(): string {
    return this.props.telephone;
  }

  public set telephone(telephone: string){
    this.props.telephone = telephone;
  }

  public get client_identifier(): string {
    return this.props.client_identifier;
  }

  public set client_identifier(client_identifier: string){
    this.props.client_identifier = client_identifier;
  }

  public get company_id(): string {
    return this.props.company_id;
  }

  public set company_id(company_id: string){
    this.props.company_id = company_id;
  }

  public get company(): Company | undefined {
    return this.props.company;
  }

  public set company(company: Company | undefined){
    this.props.company = company;
  }

  public get profiles(): Profile[] | undefined {
    return this.props.profiles;
  }

  public set profiles(profiles: Profile[] | undefined){
    this.props.profiles = profiles;
  }

  public get sales(): Sale[] | undefined {
    return this.props.sales;
  }

  public set sales(sales: Sale[] | undefined){
    this.props.sales = sales;
  }

  public get created_at(): Date {
    return this.props.created_at;
  }

  public get updated_at(): Date {
    return this.props.updated_at;
  }

  public set updated_at(updated_at: Date) {
    this.props.updated_at = updated_at;
  }
}
