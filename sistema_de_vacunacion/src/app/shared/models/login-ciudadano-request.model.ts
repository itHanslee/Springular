import { TipoDocumento } from './usuario.model';

export interface LoginCiudadanoRequest {
  numeroDocumento: string;
  ultimosDigitos: string; 
}