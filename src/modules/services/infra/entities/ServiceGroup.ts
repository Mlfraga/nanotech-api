import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';
import { Service } from './Service';
import { ServiceGroupCategory } from './ServiceGroupCategory';

export interface ServiceGroupProps {
  name: string;
  description: string | undefined;
  default_nanotech_price?: number;
  category_id?: string;
  category?: ServiceGroupCategory;
  image_url: string | undefined;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  services?: Service[];
}

export class ServiceGroup {
  private _id: string;
  private props: ServiceGroupProps;

  constructor(
    props: Replace<ServiceGroupProps, { created_at?: Date, updated_at?: Date }>,
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

  public get category_id(): string | undefined{
    return this.props.category_id;
  }

  public set category_id(category_id: string | undefined){
    this.props.category_id = category_id;
  }

  public get category(): ServiceGroupCategory | undefined{
    return this.props.category;
  }

  public set category(category: ServiceGroupCategory | undefined){
    this.props.category = category;
  }

  public get description(): string | undefined{
    return this.props.description;
  }

  public set description(description: string | undefined){
    this.props.description = description;
  }

  public get default_nanotech_price(): number | undefined{
    return this.props.default_nanotech_price;
  }

  public set default_nanotech_price(default_nanotech_price: number | undefined){
    this.props.default_nanotech_price = default_nanotech_price;
  }

  public get enabled(): boolean{
    return this.props.enabled;
  }

  public set enabled(enabled: boolean){
    this.props.enabled = enabled;
  }

  public get image_url(): string | undefined{
    return this.props.image_url;
  }

  public set image_url(image_url: string | undefined){
    this.props.image_url = image_url;
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

  public get services(): Service[] | undefined{
    return this.props.services;
  }

  public set services(services: Service[] | undefined){
    this.props.services = services;
  }
}
