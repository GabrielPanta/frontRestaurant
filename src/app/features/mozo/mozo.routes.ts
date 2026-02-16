import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MesasComponent } from '../admin/mesas/mesas.component';

@Component({
  standalone: true,
  template: `<h2>Panel Mozo</h2>`
})
class MozoHomeComponent {}

export const MOZO_ROUTES: Routes = [
  { path: '', component: MozoHomeComponent },
  {path: 'mesas', component: MesasComponent},
];
