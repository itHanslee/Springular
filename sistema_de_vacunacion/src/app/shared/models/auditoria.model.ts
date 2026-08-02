import { Usuario } from '../models/usuario.model';

export type TipoAuditoria = 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'CONSULTAR';

export interface Auditoria {
  id: number;
  tipoAuditoria: TipoAuditoria;
  fechaAuditoria: string;
  usuario: Usuario;
  descripcion: string;
}