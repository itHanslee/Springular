// shared/models/ciudadano.model.ts
export interface Ciudadano {
  id: number;
  nombre: string;
  documento: string;
  edad: number;
  ultimaVacunaAplicada?: string; // ej. "Refuerzo COVID-19 - 12/05/2026"
}