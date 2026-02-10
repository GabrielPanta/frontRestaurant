import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {

  pedidos: any[] = [];
  detalles: { [key: number]: any[] } = {};

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
    setInterval(() => this.cargarPedidos(), 10000000);
  }

  cargarPedidos() {
    this.pedidoService.pedidosCocina()
      .subscribe(data => {
        this.pedidos = data;
        data.forEach(p => this.cargarDetalles(p.id));
      });
  }

  cargarDetalles(pedidoId: number) {
    this.pedidoService.obtenerDetalles(pedidoId)
      .subscribe(items => {
        this.detalles[pedidoId] = items;
      });
  }

  marcarListo(pedidoId: number) {
    this.pedidoService.cambiarEstado(pedidoId, 'LISTO')
      .subscribe(() => this.cargarPedidos());
  }

}

