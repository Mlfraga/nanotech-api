import { Car } from '@modules/cars/infra/entities/Car';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface PersonProps {
  name: string;
  cpf: string;
  cars: Car[];
  updated_at: Date;
  created_at: Date;
}

export class Person {
  private _id: string;
  private props: PersonProps;

  constructor(
    props: Replace<PersonProps, { created_at?: Date, updated_at?: Date }>,
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

  public get cpf(): string{
    return this.props.cpf;
  }

  public set cpf(cpf: string){
    this.props.cpf = cpf;
  }

  public get cars(): Car[]{
    return this.props.cars;
  }

  public set cars(cars: Car[]){
    this.props.cars = cars;
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
