import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { API } from '../../../environments/environment';
import { Vacuna, InventarioLote } from '../../shared/models/vacuna.model';
import { InventarioItem } from '../../shared/models/inventario.model';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {

  constructor(private http: HttpClient) {}

  listar(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(
      API.VACUNAS.BASE
    );
  }

  listarVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(
      API.VACUNAS.BASE
    );
  }

  registrar(
    vacuna: Partial<Vacuna>
  ): Observable<Vacuna> {

    return this.http.post<Vacuna>(
      API.VACUNAS.BASE,
      vacuna
    );
  }

  actualizar(
    id: number,
    cambios: Partial<Vacuna>
  ): Observable<Vacuna> {

    return this.http.put<Vacuna>(
      API.VACUNAS.POR_ID(id),
      cambios
    );
  }

  cambiarEstado(
    id: number,
    estado: string
  ): Observable<void> {

    return this.http.patch<void>(
      API.VACUNAS.ESTADO(id),
      null,
      {
        params: { estado }
      }
    );
  }

  //lotes

  registrarLote(
    lote: Omit<
      InventarioLote,
      'id' | 'stockActual' | 'activo'
    >
  ): Observable<InventarioLote> {

    return this.http.post<InventarioLote>(
      API.VACUNAS.LOTES,
      lote
    );
  }


  listarLotesPorVacuna(
    idVacuna: number
  ): Observable<InventarioLote[]> {

    return this.http.get<InventarioLote[]>(
      API.VACUNAS.LOTES_POR_VACUNA(idVacuna)
    );
  }


  listarTodosLosLotesPorVacuna(
    idVacuna: number
  ): Observable<InventarioLote[]> {

    return this.http.get<InventarioLote[]>(
      API.VACUNAS.LOTES_TODOS(idVacuna)
    );
  }




listarInventarioCompleto(): Observable<{
    vacuna: Vacuna;
    lotes: InventarioLote[];
  }[]> {

    return this.listarVacunas().pipe(

      switchMap(vacunas => {

        if (vacunas.length === 0) {
          return [];
        }

        const peticiones =
          vacunas.map(vacuna =>

            this.listarTodosLosLotesPorVacuna(
              vacuna.id
            ).pipe(

              map(lotes => ({
                vacuna,
                lotes
              }))

            )
          );

        return forkJoin(peticiones);
      })
    );
  }

   listarInventario(): Observable<InventarioItem[]> {

  return this.listarInventarioCompleto().pipe(

    map(resultados =>

      resultados.flatMap(resultado =>

        resultado.lotes.map(lote => ({

          idVacuna: resultado.vacuna.id,

          nombre: resultado.vacuna.nombre,

          codigo: resultado.vacuna.codigo,

          numeroLote: lote.numeroLote,

          stock: lote.stockActual,

          fechaVencimiento: lote.fechaVencimiento

        }))

      )

    )

  );

}
}