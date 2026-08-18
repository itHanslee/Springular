import { NumeroDosis } from './numero-dosis.model';

export interface RegistrarVacunacionRequest {
  idCiudadano: number;
  idInventario: number;
  dosis: NumeroDosis;
  observaciones?: string;
  reaccionesAdversas?: boolean;
  fechaAplicacion: string;
}