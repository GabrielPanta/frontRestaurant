import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
standalone: true,
imports: [CommonModule],
templateUrl: './cajero.component.html',
styleUrls: ['./cajero.component.css']
})
export class CajeroComponent implements OnInit {

pedidos: any[] = [];
detalles: { [key: number]: any[] } = {};

constructor(private pedidoService: PedidoService) {}

ngOnInit(): void {
this.cargarPedidos();
setInterval(() => this.cargarPedidos(), 5000);
}

cargarPedidos() {
this.pedidoService.pedidosPorEstado('LISTO')
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

cerrarPedido(pedidoId: number) {
this.pedidoService.cerrarPedido(pedidoId)
.subscribe(() => this.cargarPedidos());
}

}