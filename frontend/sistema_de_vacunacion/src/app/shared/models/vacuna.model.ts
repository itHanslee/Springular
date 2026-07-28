export type viaAdministracion = "oral" | "intramuscular"| "subcutanea" | "intradermica";
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
    estado: estadoVacuna;
    fechaVencimiento: Date;
}