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
  ahora: number = Date.now();

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();

    // Refresco de datos cada 5 segundos
    this.intervalo = setInterval(() => {
      this.cargarPedidos();
      this.ahora = Date.now(); // Actualizar referencia de tiempo para los colores
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
        error: err => console.error('Error cargando cocina', err)
      });
  }

  cargarDetalles(pedidoId: number) {
    this.pedidoService.obtenerDetalles(pedidoId)
      .subscribe(items => {
        this.detalles[pedidoId] = items;
      });
  }

  getMinutosTranscurridos(fechaStr: string): number {
    if (!fechaStr) return 0;
    const fechaPedido = new Date(fechaStr).getTime();
    const diff = this.ahora - fechaPedido;
    return Math.floor(diff / 60000); // 60,000 ms en un minuto
  }

  getEstadoClase(fechaStr: string): string {
    const mins = this.getMinutosTranscurridos(fechaStr);
    if (mins < 10) return 'color-low';
    if (mins < 20) return 'color-medium';
    return 'color-high';
  }

  marcarListo(pedidoId: number) {
    this.pedidoService.cambiarEstado(pedidoId, 'LISTO')
      .subscribe(() => this.cargarPedidos());
  }
}


