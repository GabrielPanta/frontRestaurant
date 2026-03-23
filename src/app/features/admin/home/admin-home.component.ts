import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EstadisticaService } from '../../../core/services/estadistica.service';
import { MesaService } from '../../../core/services/mesa.service';
import { VentaDiaria } from '../../../core/models/estadistica';
import { Mesa } from '../../../core/models/mesa.model';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  stats: VentaDiaria = { totalVentas: 0, cantidadPedidos: 0, ticketPromedio: 0 };
  mesas: Mesa[] = [];
  loading = true;

  constructor(
    private estadisticaService: EstadisticaService,
    private mesaService: MesaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    // Cargar ventas del día
    this.estadisticaService.ventasDelDia().subscribe({
      next: data => this.stats = data,
      error: err => console.error('Error cargando ventas', err)
    });

    // Cargar estado de mesas
    this.mesaService.listar().subscribe({
      next: data => {
        this.mesas = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando mesas', err);
        this.loading = false;
      }
    });
  }

  get totalMesas() { return this.mesas.length; }
  get mesasLibres() { return this.mesas.filter(m => m.estado === 'LIBRE').length; }
  get mesasOcupadas() { return this.mesas.filter(m => m.estado === 'OCUPADA').length; }
  
  get porcentajeOcupacion() {
    if (this.totalMesas === 0) return 0;
    return Math.round((this.mesasOcupadas / this.totalMesas) * 100);
  }
}
