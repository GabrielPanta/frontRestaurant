import { Routes } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<h2>Panel Estadísticas</h2>`
})
class EstadisticasHomeComponent {}

export const ESTADISTICAS_ROUTES: Routes = [
  { path: '', component: EstadisticasHomeComponent },
  {path:'estadisticas', component: EstadisticasHomeComponent}
];