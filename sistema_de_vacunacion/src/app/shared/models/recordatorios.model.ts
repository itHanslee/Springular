export interface Recordatorio {
  id: number;
  fechaProgramada: string | Date;
  fechaEnvio?: string | Date | null;
  mensaje: string;
  estado: string;
  idUsuario: number;   
  idEsquema: number;   
}