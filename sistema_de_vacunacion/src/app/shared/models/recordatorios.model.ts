
export type Estado = 'Pendiente' | 'Enviado' | 'Fallido'; 

export interface Recordatorio {
  id: number;
  fechaProgramada: Date;
  mensaje: string;
  estado: Estado;
}