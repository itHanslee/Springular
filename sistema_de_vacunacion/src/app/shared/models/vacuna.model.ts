export type viaAdministracion = "Oral" | "Intramuscular" | "Subcutanea" | "Intradermica";
export type estadoVacuna = "ACTIVA" | "INACTIVA";

export interface Vacuna {
  id: number;
  codigo: string;
  nombre: string;
  fabricante: string;
  dosisTotales: number;
  viaAdministracion: viaAdministracion;
  temperaturaAlmacenamiento: number;
  estado: estadoVacuna;
}

export interface InventarioLote {
  id?: number;
  numeroLote: string;
  cantidadRecibida: number;
  stockActual: number;
  fechaVencimiento: string;
  activo: boolean;
  idVacuna: number;
}