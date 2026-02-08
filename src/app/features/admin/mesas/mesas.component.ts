import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MesaService } from '../../../core/services/mesa.service';
import { Mesa } from '../../../core/models/mesa.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PedidoService } from '../../../core/services/pedido.service';
import { Pedido } from '../../../core/models/pedido.model';
import { MenuItemService } from '../../../core/services/menu-item.service';



@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css']
})
export class MesasComponent implements OnInit {

  mesas: Mesa[] = [];
  pedidoActivo: any = null;
  platos: any[] = [];
  itemsPedido: any[] = [];


  nuevaMesa: Partial<Mesa> = {
    numero: 0,
    estado: 'LIBRE'
  };

  esAdmin = false;

  constructor(
    private mesaService: MesaService,
    private authService: AuthService,
    private pedidoService: PedidoService,
    private menuService: MenuItemService
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
    this.pedidoActivo = null;
    this.platos = [];
    this.itemsPedido = [];

    this.pedidoService.obtenerPedidoActivoPorMesa(mesa.id)
      .subscribe({
        next: pedido => {
          if (pedido) {
            this.pedidoActivo = pedido;
            this.cargarPlatos();
            this.cargarItemsPedido();
          } else {
            this.crearPedidoParaMesa(mesa);
          }
        }
      });
  }

  crearPedidoParaMesa(mesa: Mesa) {
    this.pedidoService.crearPedido(mesa.id)
      .subscribe(pedido => {
        this.pedidoActivo = pedido;
        this.cargarPlatos();
        this.cargarItemsPedido();
      });
  }

  cargarPlatos() {
    console.log('Cargando platos...');
    this.menuService.listarDisponibles()
      .subscribe({
        next: data => {
          console.log('Platos recibidos:', data);
          this.platos = data;
        },
        error: err => {
          console.error('Error cargando platos', err);
        }
      });
  }

  agregarPlato(plato: any) {
    if (!this.pedidoActivo) return;

    this.pedidoService.agregarItem(
      this.pedidoActivo.id,
      plato.id,
      1
    ).subscribe({
      next: () => {
        console.log('Plato agregado');
        this.cargarItemsPedido();
      },
      error: err => {
        console.error('Error agregando plato', err);
      }
    });
  }

  cargarItemsPedido() {
    if (!this.pedidoActivo) return;

    this.pedidoService.listarItems(this.pedidoActivo.id)
      .subscribe({
        next: items => {
          this.itemsPedido = items;
        },
        error: err => {
          console.error('Error cargando items', err);
        }
      });
  }

}



