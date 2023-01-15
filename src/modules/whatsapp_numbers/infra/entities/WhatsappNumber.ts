import { Company } from '@modules/companies/infra/entities/Company';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface WhatsappNumberProps {
  number: string;
  restricted_to_especific_company: boolean;
  company_id?: string;
  company?: Company;
  created_at: Date;
  updated_at: Date;
}

export class WhatsappNumber {
  private _id: string;
  private props: WhatsappNumberProps;

  constructor(
    props: Replace<WhatsappNumberProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string{
    return this._id;
  };

  public get number(): string{
    return this.props.number;
  };

  public set number(number: string){
    this.props.number = number;
  };

  public get restricted_to_especific_company(): boolean{
    return this.props.restricted_to_especific_company;
  };

  public set restricted_to_especific_company(restricted_to_especific_company: boolean){
    this.props.restricted_to_especific_company = restricted_to_especific_company;
  };

  public get company_id(): string | undefined{
    return this.props.company_id;
  };

  public set company_id(company_id: string | undefined){
    this.props.company_id = company_id;
  };

  public get company(): Company | undefined{
    return this.props.company;
  };

  public set company(company: Company | undefined){
    this.props.company = company;
  };

  public get created_at(): Date{
    return this.props.created_at;
  };

  public set created_at(created_at: Date){
    this.props.created_at = created_at;
  };

  public get updated_at(): Date{
    return this.props.updated_at;
  };

  public set updated_at(updated_at: Date){
    this.props.updated_at = updated_at;
  };
}
