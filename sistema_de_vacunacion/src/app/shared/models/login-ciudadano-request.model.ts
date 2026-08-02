import { TipoDocumento } from './usuario.model';

export interface LoginCiudadanoRequest {
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  ultimosDigitos: string; 
}