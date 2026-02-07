import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  private apiUrl = 'http://localhost:8080/mesas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  crear(mesa: Partial<Mesa>): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesa);
  }

  cambiarEstado(id: number, estado: string): Observable<Mesa> {
    return this.http.put<Mesa>(
      `${this.apiUrl}/${id}/estado`,
      null,
      { params: { estado } }
    );
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
