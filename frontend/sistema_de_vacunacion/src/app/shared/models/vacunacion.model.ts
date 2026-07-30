export type NDosis = "Primera" | "Segunda" | "Tercera" | "Refuerzo" | "Refuerzo 2" | "Unica";

export interface VacunaPendiente {
    nombreCiudadano: string;
    documentoCiudadano: string;
    vacunaNombre: string;
    numeroLote: string;
    dosis: NDosis;
    descripcion: string;

}

export interface Vacunacion {
  id: number;
  vacunaNombre: string;
  numeroLote: string;
  fechaAplicacion: Date;
  dosis: NDosis;
  ciudadanoDocumento: string;
}