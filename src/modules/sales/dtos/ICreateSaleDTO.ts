export default interface ICreateSaleDTO {
  availability_date: Date;
  delivery_date: Date;
  request_date: Date;
  company_value: number;
  cost_value: number;
  source: string;
  comments: string;
  seller_id: string;
  unit_id: string;
  person_id: string;
  car_id: string;
  status?: string;
  production_status?: string;
}
