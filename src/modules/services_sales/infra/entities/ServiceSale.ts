import { Sale } from '@modules/sales/infra/entities/Sale';
import { Service } from '@modules/services/infra/entities/Service';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface ServiceSaleProps {
  id: string;
  company_value: number;
  cost_value: number;
  sale_id: string;
  sale: Sale;
  service_id: string;
  service: Service;
  created_at: Date;
  updated_at: Date;
}

export class ServiceSale {
  private _id: string;
  private props: ServiceSaleProps;

  constructor(
    props: Replace<ServiceSaleProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string{
    return this._id;
  }

  public get company_value(): number{
    return this.props.company_value;
  }

  public set company_value(company_value: number){
    this.props.company_value = company_value;
  }

  public get cost_value(): number{
    return this.props.cost_value;
  }

  public set cost_value(cost_value: number){
    this.props.cost_value = cost_value;
  }

  public get sale_id(): string{
    return this.props.sale_id;
  }

  public set sale_id(sale_id: string){
    this.props.sale_id = sale_id;
  }

  public get sale(): Sale{
    return this.props.sale;
  }

  public set sale(sale: Sale){
    this.props.sale = sale;
  }

  public get service_id(): string{
    return this.props.service_id;
  }

  public set service_id(service_id: string){
    this.props.service_id = service_id;
  }

  public get service(): Service{
    return this.props.service;
  }

  public set service(service: Service){
    this.props.service = service;
  }

  public get created_at(): Date{
    return this.props.created_at;
  }

  public set created_at(created_at: Date){
    this.props.created_at = created_at;
  }

  public get updated_at(): Date{
    return this.props.updated_at;
  }

  public set updated_at(updated_at: Date){
    this.props.updated_at = updated_at;
  }
}
