import { Car } from '@modules/cars/infra/entities/Car';
import { Person } from '@modules/persons/infra/entities/Person';
import { Profile } from '@modules/profiles/infra/entities/Profile';
import { ServiceSale } from '@modules/services_sales/infra/entities/ServiceSale';
import { ServiceProvider } from '@modules/service_providers/infra/entities/ServiceProvider';
import { Unit } from '@modules/unities/infra/entities/Unit';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface SaleProps {
  client_identifier: string
  request_date: Date;
  availability_date: Date;
  delivery_date: Date;
  status: string;
  production_status: string;
  company_value: number;
  cost_value: number;
  source: string;
  comments: string | null;
  partner_external_id: string | null;
  techinical_comments: string | null;
  seller_id: string;
  seller: Profile;
  unit_id: string;
  unit: Unit;
  person_id: string;
  person: Person;
  car_id: string;
  car: Car;
  services_sales: ServiceSale[];
  service_providers: ServiceProvider[];
  updated_at: Date;
  created_at: Date;
  finished_at?: Date;
}

export class Sale {
  private _id: string;
  private props: SaleProps;

  constructor(
    props: Replace<SaleProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get id(): string{
    return this._id;
  }

  public get client_identifier(): string{
    return this.props.client_identifier;
  }

  public set client_identifier(client_identifier: string){
    this.props.client_identifier = client_identifier;
  }

  public get request_date(): Date{
    return this.props.request_date;
  }

  public set request_date(request_date: Date){
    this.props.request_date = request_date;
  }

  public get availability_date(): Date{
    return this.props.availability_date;
  }

  public set availability_date(availability_date: Date){
    this.props.availability_date = availability_date;
  }

  public get delivery_date(): Date{
    return this.props.delivery_date;
  }

  public set delivery_date(delivery_date: Date){
    this.props.delivery_date = delivery_date;
  }

  public get status(): string{
    return this.props.status;
  }

  public set status(status: string){
    this.props.status = status;
  }

  public get production_status(): string{
    return this.props.production_status;
  }

  public set production_status(production_status: string){
    this.props.production_status = production_status;
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

  public get source(): string{
    return this.props.source;
  }

  public set source(source: string){
    this.props.source = source;
  }

  public get comments(): string | null{
    return this.props.comments;
  }

  public set comments(comments: string | null){
    this.props.comments = comments;
  }

  public get techinical_comments(): string | null{
    return this.props.techinical_comments;
  }

  public set techinical_comments(techinical_comments: string | null){
    this.props.techinical_comments = techinical_comments;
  }

  public get seller_id(): string{
    return this.props.seller_id;
  }

  public set seller_id(seller_id: string){
    this.props.seller_id = seller_id;
  }

  public get seller(): Profile{
    return this.props.seller;
  }

  public set seller(seller: Profile){
    this.props.seller = seller;
  }

  public get unit_id(): string{
    return this.props.unit_id;
  }

  public set unit_id(unit_id: string){
    this.props.unit_id = unit_id;
  }

  public get unit(): Unit{
    return this.props.unit;
  }

  public set unit(unit: Unit){
    this.props.unit =unit ;
  }

  public get person_id(): string{
    return this.props.person_id;
  }

  public set person_id(person_id: string){
    this.props.person_id = person_id;
  }

  public get person(): Person{
    return this.props.person;
  }

  public set person(person: Person){
    this.props.person = person;
  }

  public get car_id(): string{
    return this.props.car_id;
  }

  public set car_id(car_id: string){
    this.props.car_id = car_id;
  }

  public get partner_external_id(): string | null{
    return this.props.partner_external_id;
  }

  public set partner_external_id(partner_external_id: string | null){
    this.props.partner_external_id = partner_external_id;
  }

  public get car(): Car{
    return this.props.car;
  }

  public set car(car: Car){
    this.props.car = car;
  }

  public get services_sales(): ServiceSale[]{
    return this.props.services_sales;
  }

  public set services_sales(services_sales: Array<ServiceSale>){
    this.props.services_sales = services_sales;
  }

  public get service_providers(): ServiceProvider[]{
    return this.props.service_providers;
  }

  public set service_providers(service_providers: Array<ServiceProvider>){
    this.props.service_providers = service_providers;
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

  public get finished_at(): Date | undefined{
    return this.props.finished_at;
  }

  public set finished_at(finished_at: Date | undefined){
    this.props.finished_at = finished_at;
  }

}
