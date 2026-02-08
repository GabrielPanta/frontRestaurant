import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { Mesa } from '../../../core/models/mesa.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';



@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private authService: AuthService,
    private pedidoService: PedidoService

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

  eliminarMesa(mesaId: number) {
    const confirmar = confirm('¿Seguro que deseas eliminar esta mesa?');
    if (!confirmar) return;

    this.mesaService.eliminar(mesaId).subscribe({
      next: () => this.cargarMesas(),
      error: () => alert('No se pudo eliminar la mesa')
    });
  }

  seleccionarMesa(mesa: Mesa) {
    this.pedidoService.obtenerPedidoActivoPorMesa(mesa.id)
      .subscribe({
        next: pedido => {
          if (pedido) {
            console.log('Continuar pedido existente', pedido);
          } else {
            this.crearPedidoParaMesa(mesa);
          }
        },
        error: err => {
          console.error('Error consultando pedido', err);
        }
      });
  }

  crearPedidoParaMesa(mesa: Mesa) {
    this.pedidoService.crearPedido(mesa.id)
      .subscribe({
        next: pedido => {
          console.log('Pedido creado', pedido);
          mesa.estado = 'OCUPADA';
        },
        error: err => {
          console.error('Error creando pedido', err);
        }
      });
  }



  }



