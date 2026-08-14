import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auditoria } from '../../shared/models/auditoria.model';
import { API } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private readonly baseUrl = API.AUDITORIA.BASE;

  constructor(private http: HttpClient) {}

  listar(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.baseUrl);
  }
}