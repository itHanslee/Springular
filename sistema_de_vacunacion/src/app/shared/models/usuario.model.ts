// shared/models/usuario.model.ts
export type TipoDocumento = 'CC' | 'TI' | 'CE' | 'RC'|'PA'; 
export type EstadoUsuario = 'ACTIVO' | 'INACTIVO';            
export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO';       

export interface Usuario {
  id: number;
  numeroDocumento: string;
  tipoDocumento: TipoDocumento;
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string; // sin "ñ" en el nombre de la propiedad (evita problemas de codificación en TS)
  telefono: string;
  estado: EstadoUsuario;
  fechaNacimiento: string; // formato ISO 'YYYY-MM-DD'
  genero: Genero;
  direccion: string;
}