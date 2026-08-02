import { NumeroDosis } from './numero-dosis.model';

export interface VacunaPendiente {
    nombreCiudadano: string;
    documentoCiudadano: string;
    vacunaNombre: string;
    numeroLote: string;
    dosis: NumeroDosis;
    descripcion: string;
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