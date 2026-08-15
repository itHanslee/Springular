export type viaAdministracion = "Oral" | "Intramuscular" | "Subcutanea" | "Intradermica";
export type estadoVacuna = "Activa" | "Inactiva";

export interface Vacuna {
    id: number;
    codigo: string;
    nombre: string;
    numeroLote: string;
    fabricante: string;
    dosisTotales: number;
    viaAdministracion: viaAdministracion;
    temperaturaAlmacenamiento: number;
    stock: number;
    estado: estadoVacuna;
    fechaVencimiento: Date;
    idCiudadano: number;
    idInventario: number | null;
    fechaProgramada: string;
}