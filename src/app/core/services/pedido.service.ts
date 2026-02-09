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

  crearPedido(mesaId: number) {
    return this.http.post<any>(this.apiUrl, {
      mesaId,
      items: []
    });
  }

  agregarItem(pedidoId: number, menuItemId: number, cantidad: number) {
    return this.http.post<any>(
      `${this.apiUrl}/${pedidoId}/items`,
      null,
      { params: { menuItemId, cantidad } }
    );
  }

  listarItems(pedidoId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${pedidoId}/items`);
  }

  pedidosCocina() {
    return this.http.get<any[]>(`${this.apiUrl}/cocina`);
  }

  cambiarEstado(pedidoId: number, estado: string) {
    return this.http.put<any>(
      `${this.apiUrl}/${pedidoId}/estado`,
      null,
      { params: { estado } }
    );
  }

  obtenerDetalles(pedidoId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${pedidoId}/detalles`);
  }


}



