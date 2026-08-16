import { TipoDocumento } from './usuario.model';

export interface LoginCiudadanoRequest {
  tipoDocumento: string;
  numeroDocumento: string;
  ultimosDigitos: string; 
}