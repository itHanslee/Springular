
export type Estado = 'Pendiente' | 'Enviado' | 'Fallido'; 

export interface Recordatorio {
  id: number;
  fechaProgramada: string | Date;
  fechaEnvio?: string | Date | null;
  mensaje: string;
  idUsuario: number;   
  idEsquema: number;   
  estado: Estado;


}