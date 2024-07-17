import { Company } from '@modules/companies/infra/entities/Company';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';
import { ServiceGroup } from './ServiceGroup';

export interface ServiceProps {
  name: string;
  price: number;
  enabled: boolean;
  company_price: number;
  commission_amount?: number;
  company_id?: string;
  service_group_id?: string;
  service_group?: ServiceGroup;
  company?: Company;
  created_at: Date;
  updated_at: Date;
}

export class Service {
  private _id: string;
  private props: ServiceProps;

  constructor(
    props: Replace<ServiceProps, { created_at?: Date, updated_at?: Date }>,
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

  public get price(): number{
    return this.props.price;
  }

  public set price(price: number){
    this.props.price = price;
  }

  public get enabled(): boolean{
    return this.props.enabled;
  }

  public set enabled(enabled: boolean){
    this.props.enabled = enabled;
  }

  public get company_price(): number{
    return this.props.company_price;
  }

  public set company_price(company_price: number){
    this.props.company_price = company_price;
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

  public get commission_amount(): number | undefined{
    return this.props.commission_amount;
  }

  public set commission_amount(commission_amount: number | undefined){
    this.props.commission_amount = commission_amount;
  }

  public get created_at(): Date{
    return this.props.created_at;
  }

  public set created_at(created_at: Date){
    this.props.created_at = created_at;
  }

  public get service_group_id(): string | undefined{
    return this.props.service_group_id;
  }

  public set service_group_id(service_group_id: string | undefined){
    this.props.service_group_id = service_group_id;
  }

  public get service_group(): ServiceGroup | undefined{
    return this.props.service_group;
  }

  public set service_group(service_group: ServiceGroup | undefined){
    this.props.service_group = service_group;
  }

  public get updated_at(): Date{
    return this.props.updated_at;
  }

  public set updated_at(updated_at: Date){
    this.props.updated_at = updated_at;
  }
}
