
export default interface ICreateCommisisonerDTO {
  name: string;
  company_id: string;
  pix_key_type:  'CPF' | 'PHONE' | 'EMAIL' | 'RANDOM';
  pix_key: string;
  telephone: string;
}
