import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstadisticaService } from '../../core/services/estadistica.service';
import { ProductoMasVendido, PuntoSerieTemporal } from '../../core/models/estadistica';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit, OnDestroy {

  @ViewChild('prodChart') prodChartCanvas!: ElementRef;
  @ViewChild('donutChart') donutChartCanvas!: ElementRef;
  @ViewChild('timelineChart') timelineChartCanvas?: ElementRef;

  productos: ProductoMasVendido[] = [];
  serieTemporal: PuntoSerieTemporal[] = [];
  totalVentas: number = 0;
  ticketPromedio: number = 0;
  cantidadPedidos: number = 0;

  // Fechas de filtro (YYYY-MM-DD)
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroActivo: string = 'hoy'; // 'hoy', 'ayer', '7dias', 'mes', 'custom'
  loading: boolean = false;

  private charts: Chart[] = [];

  constructor(private estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    this.aplicarPreset('hoy');
  }

  ngOnDestroy(): void {
    this.destruirGraficos();
  }

  destruirGraficos() {
    this.charts.forEach(chart => chart.destroy());
    this.charts = [];
  }

  formatearFechaISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  aplicarPreset(preset: string) {
    this.filtroActivo = preset;
    const hoy = new Date();

    if (preset === 'hoy') {
      const hoyStr = this.formatearFechaISO(hoy);
      this.fechaInicio = hoyStr;
      this.fechaFin = hoyStr;
    } else if (preset === 'ayer') {
      const ayer = new Date();
      ayer.setDate(hoy.getDate() - 1);
      const ayerStr = this.formatearFechaISO(ayer);
      this.fechaInicio = ayerStr;
      this.fechaFin = ayerStr;
    } else if (preset === '7dias') {
      const sieteDias = new Date();
      sieteDias.setDate(hoy.getDate() - 6);
      this.fechaInicio = this.formatearFechaISO(sieteDias);
      this.fechaFin = this.formatearFechaISO(hoy);
    } else if (preset === 'mes') {
      const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      this.fechaInicio = this.formatearFechaISO(primerDiaMes);
      this.fechaFin = this.formatearFechaISO(hoy);
    }

    this.consultar();
  }

  onCustomDateChange() {
    this.filtroActivo = 'custom';
  }

  consultar() {
    if (!this.fechaInicio || !this.fechaFin) return;

    this.loading = true;

    this.estadisticaService.resumenPorRango(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.totalVentas = data?.totalVentas ?? 0;
        this.ticketPromedio = data?.ticketPromedio ?? 0;
        this.cantidadPedidos = data?.cantidadPedidos ?? 0;
        this.serieTemporal = data?.serieTemporal ?? [];
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al cargar ventas por rango', err);
        this.loading = false;
      }
    });
  }

  cargarProductos() {
    this.estadisticaService.productosMasVendidosPorRango(this.fechaInicio, this.fechaFin).subscribe({
      next: (productos) => {
        this.productos = productos || [];
        this.loading = false;
        setTimeout(() => this.renderCharts(), 150);
      },
      error: (err) => {
        console.error('Error cargando productos más vendidos', err);
        this.loading = false;
        setTimeout(() => this.renderCharts(), 150);
      }
    });
  }

  renderCharts() {
    this.destruirGraficos();

    // 1. Gráfico de Evolución de Ventas (si hay canvas)
    if (this.timelineChartCanvas?.nativeElement && this.serieTemporal.length > 0) {
      const timeCtx = this.timelineChartCanvas.nativeElement.getContext('2d');
      const timeLabels = this.serieTemporal.map(p => p.fecha);
      const timeValues = this.serieTemporal.map(p => p.total);

      this.charts.push(new Chart(timeCtx, {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [{
            label: 'Ventas (S/)',
            data: timeValues,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#4f46e5',
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => ` Total: S/ ${(context.parsed.y ?? 0).toFixed(2)}`
              }
            }
          },
          scales: {
            x: { grid: { display: false } },
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => `S/ ${val}`
              }
            }
          }
        }
      }));
    }

    // 2. Gráfico de Barras Horizontal (Ranking Productos)
    if (this.prodChartCanvas?.nativeElement) {
      const barCtx = this.prodChartCanvas.nativeElement.getContext('2d');
      const labels = this.productos.map(p => p.nombre);
      const data = this.productos.map(p => p.cantidad);

      this.charts.push(new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: labels.length ? labels : ['Sin datos'],
          datasets: [{
            label: 'Unidades Vendidas',
            data: data.length ? data : [0],
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
            x: { grid: { display: false }, beginAtZero: true },
            y: { grid: { display: false } }
          }
        }
      }));
    }

    // 3. Gráfico de Dona (Distribución)
    if (this.donutChartCanvas?.nativeElement) {
      const donutCtx = this.donutChartCanvas.nativeElement.getContext('2d');
      const labels = this.productos.map(p => p.nombre);
      const data = this.productos.map(p => p.cantidad);

      this.charts.push(new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: labels.length ? labels : ['Sin datos'],
          datasets: [{
            data: data.length ? data : [1],
            backgroundColor: labels.length ? [
              '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#3b82f6', '#14b8a6', '#f59e0b'
            ] : ['#e2e8f0'],
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
}
