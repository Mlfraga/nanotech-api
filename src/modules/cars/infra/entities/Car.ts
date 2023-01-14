import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface NotificationProps {
  brand: string;
  model: string;
  plate: string;
  color: string;
  person_id: string;
  // person?: Person;
  created_at: Date;
  updated_at: Date;
}

export class Car {
  private _id: string;
  private props: NotificationProps;

  constructor(
    props: Replace<NotificationProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string {
    return this._id;
  }

  public get brand(): string {
    return this.props.brand;
  }

  public set brand(brand: string){
    this.props.brand = brand;
  }

  public get model(): string {
    return this.props.model;
  }

  public set model(model: string){
    this.props.model = model;
  }

  public get plate(): string {
    return this.props.plate;
  }

  public set plate(plate: string){
    this.props.plate = plate;
  }

  public get color(): string {
    return this.props.color;
  }

  public set color(color: string){
    this.props.color = color;
  }

  public get person_id(): string {
    return this.props.person_id;
  }

  public set person_id(person_id: string){
    this.props.person_id = person_id;
  }

  // public get person(): Person {
  //   return this.props.person;
  // }

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
