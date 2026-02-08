import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  obtenerPedidoActivoPorMesa(mesaId: number): Observable<Pedido | null> {
    return this.http.get<Pedido | null>(`${this.apiUrl}/mesa/${mesaId}/activo`);
  }
}



