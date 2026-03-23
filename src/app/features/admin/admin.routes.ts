import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { MesasComponent } from './mesas/mesas.component';
import { CocinaComponent } from '../cocina/cocina.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario.component';
import { ListarUsuariosComponent } from './usuarios/listar-usuarios.component';
import { CajeroComponent } from '../cajero/cajero.component';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';

import { AdminHomeComponent } from './home/admin-home.component';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'menu', component: MenuAdminComponent },
  { path: 'mesas', component:MesasComponent },
  {path:'pedidos',component: CocinaComponent},
  { path: 'usuarios', component: ListarUsuariosComponent },
  { path: 'usuarios/crear', component: CrearUsuarioComponent },
  {path:'pedido',component:CajeroComponent},
  {path:'estadisticas', component: EstadisticasComponent}

];

