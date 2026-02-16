import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoMasVendido, VentaDiaria } from '../models/estadistica';

@Injectable({
providedIn: 'root'
})
export class EstadisticaService {

private api = 'http://localhost:8080/estadisticas';

constructor(private http: HttpClient) {}

productosMasVendidos(): Observable<ProductoMasVendido[]> {
return this.http.get<ProductoMasVendido[]>(`${this.api}/productos-mas-vendidos`);
}

ventasDelDia(): Observable<VentaDiaria> {
return this.http.get<VentaDiaria>(`${this.api}/hoy`);
}
}