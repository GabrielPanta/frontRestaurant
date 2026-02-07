import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { Mesa } from '../../../core/models/mesa.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {

  mesas: Mesa[] = [];

  nuevaMesa: Partial<Mesa> = {
  numero: 0,
  estado: 'LIBRE'
};

  esAdmin = false;

    constructor(
        private mesaService: MesaService,
        private authService: AuthService

    ) { }

  ngOnInit(): void {
    this.cargarMesas();
    this.esAdmin = this.authService.isAdmin();
  }

  cargarMesas() {
    this.mesaService.listar().subscribe(data => {
      this.mesas = data;
    });
  }

  crearMesa() {
  if (!this.nuevaMesa.numero) return;

  const existe = this.mesas.some(m => m.numero === this.nuevaMesa.numero);
  if (existe) {
    alert('Ya existe una mesa con ese número');
    return;
  }

  this.mesaService.crear(this.nuevaMesa).subscribe({
    next: () => {
      this.nuevaMesa.numero = 0;
      this.cargarMesas();
    },
    error: err => {
      alert(err.error?.message || 'Error al crear mesa');
    }
  });
}


  cambiarEstado(mesa: Mesa, estado: string) {
    this.mesaService.cambiarEstado(mesa.id, estado)
      .subscribe(() => this.cargarMesas());
  }
}
