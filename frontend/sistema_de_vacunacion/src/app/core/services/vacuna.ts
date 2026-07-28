import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Vacuna} from '../../shared/models/vacuna.model';

@Injectable({ providedIn: 'root',})
export class VacunaService {
  private readonly baseUrl = 'http://localhost:8080/api/vacunas';
  constructor(private http: HttpClient) {}

  listarVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(this.baseUrl);
  }

}