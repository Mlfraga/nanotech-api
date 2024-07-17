import { Unit } from '@modules/unities/infra/entities/Unit';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface NotificationProps {
  name: string;
  cnpj: string;
  telephone: string;
  client_identifier: string;
  created_at: Date;
  updated_at: Date;
  unities: Unit[];
}

export class Company {
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

  public get name(): string {
    return this.props.name;
  }

  public set name(name: string){
    this.props.name = name;
  }

  public get cnpj(): string {
    return this.props.cnpj;
  }

  public set cnpj(cnpj: string){
    this.props.cnpj = cnpj;
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

  public get created_at(): Date {
    return this.props.created_at;
  }

  public get updated_at(): Date {
    return this.props.updated_at;
  }

  public set updated_at(updated_at: Date) {
    this.props.updated_at = updated_at;
  }

  public get unities(): Unit[] {
    return this.props.unities;
  }

  public set unities(unities: Unit[]) {
    this.props.unities = unities;
  }
}
