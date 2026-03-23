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

  mesaSeleccionada: Mesa | null = null;

  pedidoActivo: any = null;

  platos: any[] = [];
  itemsPedido: any[] = [];

  nuevaMesa: Partial<Mesa> = {
    numero: 0,
    estado: 'LIBRE'
  };

  esAdmin = false;
  filtroPlato: string = '';

  get platosFiltrados() {
    if (!this.filtroPlato) return this.platos;
    const filter = this.filtroPlato.toLowerCase();
    return this.platos.filter(plato => 
      plato.nombre.toLowerCase().includes(filter)
    );
  }

  constructor(
    private mesaService: MesaService,
    private pedidoService: PedidoService,
    private menuService: MenuItemService,
    private authService: AuthService
  ) {}

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
    if (!confirm('¿Seguro que deseas eliminar esta mesa?')) return;

    this.mesaService.eliminar(mesaId).subscribe({
      next: () => this.cargarMesas(),
      error: () => alert('No se pudo eliminar la mesa')
    });
  }

  abrirPedido(mesa: Mesa) {

    this.mesaSeleccionada = mesa;
    this.itemsPedido = [];

    this.pedidoService.obtenerPedidoActivoPorMesa(mesa.id)
      .subscribe({
        next: pedido => {
          if (pedido) {
            this.pedidoActivo = pedido;
            this.cargarItemsPedido();
          } else {
            this.pedidoActivo = null;
          }
          this.cargarPlatos();
        },
        error: () => {
          this.pedidoActivo = null;
          this.cargarPlatos();
        }
      });
  }



  cargarPlatos() {
    this.menuService.listarDisponibles().subscribe({
      next: data => {
        this.platos = data;
      },
      error: err => {
        console.error('Error cargando platos', err);
      }
    });
  }

  agregarPlato(plato: any) {

    if (!this.mesaSeleccionada) return;

    if (!this.pedidoActivo) {
      const request = {
        mesaId: this.mesaSeleccionada.id,
        items: [
          {
            menuItemId: plato.id,
            cantidad: 1
          }
        ]
      };

      this.pedidoService.crearPedidoConItems(request).subscribe({
        next: (pedido: any) => {
          this.pedidoActivo = pedido;
          this.cargarItemsPedido();
          this.cargarMesas();
          
          // ASEGURAR VISIBILIDAD EN COCINA:
          this.pedidoService.cambiarEstado(pedido.id, 'EN_PREPARACION').subscribe({
            next: () => {
              this.pedidoActivo.estado = 'EN_PREPARACION';
              this.cargarMesas();
            }
          });
        },
        error: err => {
          alert(err.error?.message || 'Error al crear pedido');
        }
      });

      return;
    }

    this.pedidoService.agregarItem(
      this.pedidoActivo.id,
      plato.id,
      1
    ).subscribe(() => {
      this.cargarItemsPedido();
      
      this.pedidoService.cambiarEstado(this.pedidoActivo.id, 'EN_PREPARACION').subscribe({
        next: () => {
          this.pedidoActivo.estado = 'EN_PREPARACION';
          this.cargarMesas(); 
        },
        error: () => this.cargarMesas()
      });
    });
  }

  quitarPlato(plato: any) {
    if (!this.pedidoActivo) return;

    this.pedidoService.agregarItem(
      this.pedidoActivo.id,
      plato.id,
      -1
    ).subscribe(() => {
      this.cargarItemsPedido();
    });
  }

  cargarItemsPedido() {
    if (!this.pedidoActivo) return;

    this.pedidoService.listarItems(this.pedidoActivo.id).subscribe({
      next: items => {
        this.itemsPedido = items;
        // Recalcular total localmente para actualización instantánea
        if (this.pedidoActivo) {
          const total = items.reduce((acc: number, item: any) => acc + (item.precio * item.cantidad), 0);
          this.pedidoActivo.total = total;
        }
      },
      error: err => {
        console.error('Error cargando items', err);
      }
    });
  }

 cerrarPedido() {
  if (!this.pedidoActivo || this.itemsPedido.length === 0) return;

  this.pedidoService.cerrarPedido(this.pedidoActivo.id).subscribe(() => {
    this.pedidoActivo = null;
    this.cerrarModal();
    this.cargarMesas();
  });
}


  cerrarModal() {
    this.mesaSeleccionada = null;
    this.itemsPedido = [];
    this.filtroPlato = '';
  }


  imprimirTicket() {
    window.print();
  }
}




