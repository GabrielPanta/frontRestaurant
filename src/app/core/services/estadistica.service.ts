import { HttpClient } from '@angular/common/http';
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

ventasDelDia(): Observable<VentaDiaria> {
return this.http.get<VentaDiaria>(`${this.api}/hoy`);
}
}