import { Usuario } from '../models/usuario.model';

export type TipoAuditoria = 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'CONSULTAR';

export interface Auditoria {
  idAuditoria: number;
  tipoAccion: TipoAuditoria;
  tablaAfectada: string;
  fechaAccion: string;
  idUsuario: Usuario;
  nombreUsuario?: string;
  apellidoUsuario?: string;
  datosAnteriores?: string | null;
  datosNuevos?: string | null;
}