import { Component, OnInit } from '@angular/core';
import { EstadisticaService } from '../../core/services/estadistica.service';
import { ProductoMasVendido, VentaDiaria } from '../../core/models/estadistica';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
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
  today: Date = new Date();

  constructor(private estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    this.cargarProductosMasVendidos();
    this.cargarVentasHoy();
  }

  cargarProductosMasVendidos() {
    this.estadisticaService.productosMasVendidos().subscribe((data: ProductoMasVendido[]) => {
      this.productos = data;
    });
  }

  getPorcentaje(cantidad: number): number {
    if (this.productos.length === 0) return 0;
    const max = Math.max(...this.productos.map(p => p.cantidad));
    return (cantidad / max) * 100;
  }

  cargarVentasHoy() {
    this.estadisticaService.ventasDelDia().subscribe((data: VentaDiaria) => {
      this.totalVentasHoy = data.totalVentas;
      this.ticketPromedio = data.ticketPromedio;
      this.cantidadPedidos = data.cantidadPedidos;
    });
  }
}
