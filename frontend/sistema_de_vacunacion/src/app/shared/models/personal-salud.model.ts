import { Usuario } from './usuario.model';

export interface PersonalSalud extends Usuario {
  cargo: string;
}