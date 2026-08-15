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
  id: number;
  vacunaNombre: string;
  numeroLote: string;
  fechaAplicacion: Date;
  dosis: NumeroDosis;
  ciudadanoDocumento: string;
  aplicadoPor: string;
}