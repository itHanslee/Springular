import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  forkJoin,
  map,
  switchMap
} from 'rxjs';

import { API } from '../../../environments/environment';
import { Vacuna } from '../../shared/models/vacuna.model';
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

  listarInventario(): Observable<InventarioItem[]> {

    return this.listarVacunas().pipe(

      switchMap((vacunas: Vacuna[]) => {

        const peticiones = vacunas.map(
          (vacuna: Vacuna) =>

            this.http.get<any[]>(
              API.VACUNAS.LOTES_POR_VACUNA(vacuna.id)
            ).pipe(

              map(lotes =>
                lotes.map(lote => ({
                  idVacuna: vacuna.id,
                  nombre: vacuna.nombre,
                  codigo: vacuna.codigo,
                  numeroLote: lote.numeroLote,
                  stock: lote.stockActual,
                  fechaVencimiento: lote.fechaVencimiento
                }))
              )
            )
        );

        return forkJoin(peticiones).pipe(
          map(resultados =>
            resultados.flat()
          )
        );
      })
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
}