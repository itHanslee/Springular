// shared/models/ciudadano.model.ts
import { Usuario } from './usuario.model';

export interface Ciudadano extends Usuario {
  ultimaVacunaAplicada?: string;
}