import { Profile } from '@modules/profiles/infra/entities/Profile';
import { Replace } from '@shared/helpers/Replace';
import { randomUUID } from 'node:crypto';

export interface UserProps {
  telephone: string;
  username: string;
  password: string;
  role:
    | 'SELLER'
    | 'MANAGER'
    | 'ADMIN'
    | 'NANOTECH_REPRESENTATIVE'
    | 'SERVICE_PROVIDER';
  first_login: boolean;
  enabled: boolean;
  profile?: Profile;
  updated_at: Date;
  created_at: Date;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(
    props: Replace<UserProps, { created_at?: Date, updated_at?: Date }>,
    id?: string,
  ) {
    this.props = { ...props, updated_at: props.updated_at ?? new Date(), created_at: props.created_at ?? new Date() };
    this._id = id ?? randomUUID();
  }

  public get telephone(): string{
    return this.props.telephone;
  }

  public set telephone(telephone: string){
    this.props.telephone = telephone;
  }

  public get username(): string{
    return this.props.username;
  }

  public set username(username: string){
    this.props.username = username;
  }

  public get password(): string{
    return this.props.password;
  }

  public set password(password: string){
    this.props.password = password;
  }

  public get role(): 'SELLER' | 'MANAGER' | 'ADMIN' | 'NANOTECH_REPRESENTATIVE' | 'SERVICE_PROVIDER'{
    return this.props.role;
  }

  public set role(role: 'SELLER' | 'MANAGER' | 'ADMIN' | 'NANOTECH_REPRESENTATIVE' | 'SERVICE_PROVIDER'){
    this.props.role = role;
  }

  public get first_login(): boolean{
    return this.props.first_login;
  }

  public set first_login(first_login: boolean){
    this.props.first_login = first_login;
  }

  public get enabled(): boolean{
    return this.props.enabled;
  }

  public set enabled(enabled: boolean){
    this.props.enabled = enabled;
  }

  public get profile(): Profile | undefined{
    return this.props.profile;
  }

  public set profile(profile: Profile | undefined){
    this.props.profile = profile;
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

  public set created_at(created_at: Date) {
    this.props.created_at = created_at
  }
}
