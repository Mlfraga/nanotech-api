export default interface ICreateUserDTO {
  email: string;
  username: string;
  telephone: string;
  password: string;
  role: 'SELLER' | 'MANAGER' | 'ADMIN' | 'NANOTECH_REPRESENTATIVE';
}
