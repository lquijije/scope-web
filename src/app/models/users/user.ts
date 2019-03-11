import { IProfile } from './profile';

export interface IUser {
    id?: string;
    cedula?: string;
    nombre?: string;
    genero?: string;
    email?: string;
    password?: string;
    estado?: string;
    perfil?: IProfile[];
}
