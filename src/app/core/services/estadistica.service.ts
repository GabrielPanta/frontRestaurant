import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoMasVendido, VentaDiaria } from '../models/estadistica';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {

  private api = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  productosMasVendidos(): Observable<ProductoMasVendido[]> {
    return this.http.get<ProductoMasVendido[]>(`${this.api}/productos-mas-vendidos`);
  }

  productosMasVendidosPorRango(inicio: string, fin: string): Observable<ProductoMasVendido[]> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<ProductoMasVendido[]>(`${this.api}/productos-mas-vendidos/rango`, { params });
  }

  ventasDelDia(): Observable<VentaDiaria> {
    return this.http.get<VentaDiaria>(`${this.api}/hoy`);
  }

  resumenPorRango(inicio: string, fin: string): Observable<VentaDiaria> {
    const params = new HttpParams().set('inicio', inicio).set('fin', fin);
    return this.http.get<VentaDiaria>(`${this.api}/rango`, { params });
  }
}