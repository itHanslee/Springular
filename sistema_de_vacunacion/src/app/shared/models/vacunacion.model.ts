import { NumeroDosis } from './numero-dosis.model';

export interface VacunaPendiente {
  idCiudadano: number;
  idInventario: number | null;
  nombreCiudadano: string;
  documentoCiudadano: string;
  vacunaNombre: string;
  numeroLote: string;
  dosis: NumeroDosis;
  descripcion: string;
  fechaProgramada: string;
}

export interface Vacunacion {
  idVacunacion: number;
  vacuna: string;
  numeroLote: string | null;
  dosis: NumeroDosis;
  fechaAplicacion: string;
  aplicadoPor: string;
  observaciones?: string;
  reaccionesAdversas?: boolean;
}