import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { EstadisticaService } from '../../core/services/estadistica.service';
import { ProductoMasVendido, VentaDiaria } from '../../core/models/estadistica';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, OnDestroy {

  @ViewChild('prodChart') prodChartCanvas!: ElementRef;
  @ViewChild('donutChart') donutChartCanvas!: ElementRef;

  productos: ProductoMasVendido[] = [];
  totalVentasHoy: number = 0;
  ticketPromedio: number = 0;
  cantidadPedidos: number = 0;
  today: Date = new Date();

  private charts: Chart[] = [];

  constructor(private estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  cargarDatos() {
    // Cargar todo y luego renderizar
    this.estadisticaService.ventasDelDia().subscribe((data) => {
      this.totalVentasHoy = data.totalVentas;
      this.ticketPromedio = data.ticketPromedio;
      this.cantidadPedidos = data.cantidadPedidos;
      
      this.estadisticaService.productosMasVendidos().subscribe((productos) => {
        this.productos = productos;
        setTimeout(() => this.renderCharts(), 100);
      });
    });
  }

  renderCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];

    const labels = this.productos.map(p => p.nombre);
    const data = this.productos.map(p => p.cantidad);

    // Gráfico de Barras Horizontal
    const barCtx = this.prodChartCanvas.nativeElement.getContext('2d');
    this.charts.push(new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Unidades Vendidas',
          data: data,
          backgroundColor: '#6366f1',
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { display: false } }
        }
      }
    }));

    // Gráfico de Dona
    const donutCtx = this.donutChartCanvas.nativeElement.getContext('2d');
    this.charts.push(new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, usePointStyle: true }
          }
        },
        cutout: '70%'
      }
    }));
  }
}
