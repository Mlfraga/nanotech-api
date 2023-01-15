import { Company } from '@modules/companies/infra/entities/Company';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface CompanyPriceProps {
  price: number;
  company_id: string;
  company: Company;
  created_at: Date;
  updated_at: Date;
}

export class CompanyPrice {
  private _id: string;
  private props: CompanyPriceProps;

  constructor(
    props: Replace<CompanyPriceProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string{
    return this._id;
  }

  public set price(price: number){
    this.props.price = price;
  }

  public get price(): number{
    return this.props.price;
  }

  public set company_id(company_id: string){
    this.props.company_id = company_id;
  }

  public get company_id(): string{
    return this.props.company_id;
  }

  public set company(company: Company){
    this.props.company = company;
  }

  public get company(): Company{
    return this.props.company;
  }

  public set created_at(created_at: Date){
    this.props.created_at = created_at;
  }

  public get created_at(): Date{
    return this.props.created_at;
  }

  public set updated_at(updated_at: Date){
    this.props.updated_at = updated_at;
  }

  public get updated_at(): Date{
    return this.props.updated_at;
  }
}
