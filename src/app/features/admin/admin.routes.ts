import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { MesasComponent } from './mesas/mesas.component';
import { CocinaComponent } from '../cocina/cocina.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario.component';
import { CajeroComponent } from '../cajero/cajero.component';

@Component({
  standalone: true,
  template: `
    <div class="card">
      <h2>Panel Administrador</h2>
      <p>Desde aquí podrás gestionar usuarios, platos y configuraciones del sistema.</p>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }
  `]
})
export class AdminHomeComponent {}

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'menu', component: MenuAdminComponent },
  { path: 'mesas', component:MesasComponent },
  {path:'pedidos',component: CocinaComponent},
  {path: 'usuarios',component: CrearUsuarioComponent},
  {path:'pedido',component:CajeroComponent}

];

