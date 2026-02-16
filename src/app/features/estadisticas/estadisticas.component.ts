import { Component, OnInit } from '@angular/core';
import { EstadisticaService } from '../../core/services/estadistica.service';
import { ProductoMasVendido } from '../../core/models/estadistica';
import { CommonModule } from '@angular/common';

@Component({
standalone: true,
imports: [CommonModule],
templateUrl: './estadisticas.component.html',
styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

productos: ProductoMasVendido[] = [];
totalVentasHoy: number = 0;
ticketPromedio: number = 0;
cantidadPedidos: number = 0;

constructor(private estadisticaService: EstadisticaService) {}

ngOnInit(): void {
this.cargarProductosMasVendidos();
this.cargarVentasHoy();
}

cargarProductosMasVendidos() {
this.estadisticaService.productosMasVendidos().subscribe(data => {
this.productos = data;
});
}

cargarVentasHoy() {
this.estadisticaService.ventasDelDia().subscribe(data => {
this.totalVentasHoy = data.totalVentas;
this.ticketPromedio = data.ticketPromedio;
this.cantidadPedidos = data.cantidadPedidos;
});
}
}
