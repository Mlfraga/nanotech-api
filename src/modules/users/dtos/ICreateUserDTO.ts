export default interface ICreateUserDTO {
  email: string;
  username: string;
  telephone: string;
  password: string;
  role:
    | 'SELLER'
    | 'MANAGER'
    | 'ADMIN'
    | 'COMMISSIONER'
    | 'NANOTECH_REPRESENTATIVE'
    | 'SERVICE_PROVIDER';
    pix_key_type?:  'CPF' | 'PHONE' | 'EMAIL' | 'RANDOM';
    pix_key?: string;
}
