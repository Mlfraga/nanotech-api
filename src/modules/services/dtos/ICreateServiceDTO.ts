export default interface ICreateServiceDTO {
  service_group_id?: string;
  name: string;
  price: number;
  commission_amount?: number;
  company_id?: string;
}
