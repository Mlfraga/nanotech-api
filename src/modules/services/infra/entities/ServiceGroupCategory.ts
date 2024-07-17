import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';
import { ServiceGroup } from './ServiceGroup';

export interface ServiceGroupCategoryProps {
  name: string;
  created_at: Date;
  updated_at: Date;
  service_groups?: ServiceGroup[];
}

export class ServiceGroupCategory {
  private _id: string;
  private props: ServiceGroupCategoryProps;

  constructor(
    props: Replace<ServiceGroupCategoryProps, { created_at?: Date, updated_at?: Date }>,
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

  public get service_groups(): ServiceGroup[] | undefined{
    return this.props.service_groups;
  }

  public set service_groups(service_groups: ServiceGroup[] | undefined){
    this.props.service_groups = service_groups;
  }
}
