export type Estado = 'Pendiente' | 'Enviado' | 'Fallido';

export interface Recordatorio {
  id: number;
  idCiudadano: number;
  idEsquema: number;
  vacunaNombre: string;
  fechaProgramada: string | Date;
  fechaEnvio?: string | Date | null;
  mensaje: string;
  estado: Estado;
}