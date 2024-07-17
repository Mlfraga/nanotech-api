import { Profile } from '@modules/profiles/infra/entities/Profile';
import { Sale } from '@modules/sales/infra/entities/Sale';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface ServiceProviderProps {
  sale_id: string;
  service_provider_profile_id: string;
  date_to_be_done: Date;
  sale: Sale;
  provider: Profile;
}

export class ServiceProvider {
  private _id: string;
  private props: ServiceProviderProps;

  constructor(
    props: Replace<ServiceProviderProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props };
    this._id = id ?? randomUUID();
  }

  public get id(): string {
    return this._id;
  }

  public get sale_id(): string{
    return this.props.sale_id;
  }

  public set sale_id(sale_id: string){
    sale_id = this.props.sale_id;
  }

  public get service_provider_profile_id(): string{
    return this.props.service_provider_profile_id;
  }

  public set service_provider_profile_id(service_provider_profile_id: string){
    service_provider_profile_id = this.props.service_provider_profile_id;
  }

  public get date_to_be_done(): Date{
    return this.props.date_to_be_done;
  }

  public set date_to_be_done(date_to_be_done: Date){
    date_to_be_done = this.props.date_to_be_done;
  }

  public get sale(): Sale{
    return this.props.sale;
  }

  public set sale(sale: Sale){
    sale = this.props.sale;
  }

  public get provider(): Profile{
    return this.props.provider;
  }

  public set provider(provider: Profile){
    provider = this.props.provider;
  }
}
