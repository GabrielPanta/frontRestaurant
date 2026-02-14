import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit, OnDestroy {

  pedidos: any[] = [];
  detalles: { [key: number]: any[] } = {};
  intervalo: any;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();

    // refresco cada 5 segundos (tiempo real cocina)
    this.intervalo = setInterval(() => {
      this.cargarPedidos();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  cargarPedidos() {
    this.pedidoService.pedidosCocina()
      .subscribe({
        next: data => {
          this.pedidos = data;
          data.forEach(p => this.cargarDetalles(p.id));
        },
        error: err => {
          console.error('Error cargando pedidos cocina', err);
        }
      });
  }

  cargarDetalles(pedidoId: number) {
    this.pedidoService.obtenerDetalles(pedidoId)
      .subscribe({
        next: items => {
          this.detalles[pedidoId] = items;
        },
        error: err => {
          console.error('Error cargando detalles', err);
        }
      });
  }

  marcarListo(pedidoId: number) {
    this.pedidoService.cambiarEstado(pedidoId, 'LISTO')
      .subscribe({
        next: () => this.cargarPedidos(),
        error: err => console.error('Error cambiando estado', err)
      });
  }
}


