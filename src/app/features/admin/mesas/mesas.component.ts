import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { Mesa } from '../../../core/models/mesa.model';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {

  mesas: Mesa[] = [];

  constructor(private mesaService: MesaService) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas() {
    this.mesaService.listar().subscribe(data => {
      this.mesas = data;
    });
  }

  cambiarEstado(mesa: Mesa, estado: string) {
    this.mesaService.cambiarEstado(mesa.id, estado)
      .subscribe(() => this.cargarMesas());
  }
}
