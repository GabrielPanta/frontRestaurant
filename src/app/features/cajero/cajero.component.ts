import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-cajero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cajero.component.html',
  styleUrls: ['./cajero.component.css']
})
export class CajeroComponent implements OnInit {

  pedidos: any[] = [];
  detalles: { [key: number]: any[] } = {};
  pedidoSeleccionado: any = null;
  loading = false;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
    // Actualización silenciosa cada 10 segundos
    setInterval(() => this.cargarPedidos(true), 10000);
  }

  cargarPedidos(silencioso = false) {
    if (!silencioso) this.loading = true;
    this.pedidoService.pedidosPorEstado('LISTO').subscribe({
      next: data => {
        this.pedidos = data;
        this.loading = false;
        // Auto-selección si hay pedidos y ninguno está seleccionado
        if (data.length > 0 && !this.pedidoSeleccionado) {
          this.seleccionarPedido(data[0]);
        }
        data.forEach(p => this.cargarDetalles(p.id));
      },
      error: () => this.loading = false
    });
  }

  seleccionarPedido(pedido: any) {
    this.pedidoSeleccionado = pedido;
    if (!this.detalles[pedido.id]) {
      this.cargarDetalles(pedido.id);
    }
  }

  cargarDetalles(pedidoId: number) {
    this.pedidoService.obtenerDetalles(pedidoId).subscribe({
      next: items => {
        this.detalles[pedidoId] = items;
      },
      error: err => console.error('Error cargando detalles del pedido', err)
    });
  }

  cerrarPedido(pedidoId: number) {
    if (!confirm('¿Confirmar cobro y cierre de pedido?')) return;
    
    this.pedidoService.cerrarPedido(pedidoId).subscribe({
      next: () => {
        this.pedidoSeleccionado = null;
        this.cargarPedidos();
      },
      error: err => alert(err.error?.message || 'Error al cerrar el pedido')
    });
  }

  imprimirTicket() {
    window.print();
  }
}