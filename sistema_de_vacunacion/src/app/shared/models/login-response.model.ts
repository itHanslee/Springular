import {Usuario} from './usuario.model';

export type TipoUsuario = 'ADMINISTRADOR' | 'PERSONAL_SALUD'|'CIUDADANO'; 

export interface LoginResponse {
    token: string;
    tipoUsuario: TipoUsuario;
    usuario: Usuario;

}