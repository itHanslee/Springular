import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from '../../../app/shared/models/auditoria.model';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly baseUrl = '/api/auditorias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.baseUrl);
  }
}