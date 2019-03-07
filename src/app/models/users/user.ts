import { IProfile } from "./profile";

export interface IUser {
    id?: string;
    cedula?: string;
    nombre?: string;
    genero?: string;
    email?: string;
    estado?: string;
    perfil?: IProfile[];
}
