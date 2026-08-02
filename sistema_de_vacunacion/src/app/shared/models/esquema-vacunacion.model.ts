// esquema-vacunacion.model.ts (corregido)
import { NumeroDosis } from './numero-dosis.model';

export type CriterioCalculo = "POR_EDAD" | "POR_INTERVALO";

export interface EsquemaVacunacion {
  id: number;
  vacunaId: number;
  edadMinimaAplicacion: number;
  dosisNumero: NumeroDosis;
  intervaloDias: number;
  criterioCalculo: CriterioCalculo;
}

export interface ProximaDosisResult {
  proximaFecha: Date;
  dosisNumero: NumeroDosis;
}