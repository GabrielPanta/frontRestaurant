import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CocinaComponent } from './cocina.component';

@Component({
  standalone: true,
  template: `<h2>Panel Cocina kk</h2>`
})
class CocinaHomeComponent {}

export const COCINA_ROUTES: Routes = [
  { path: '', component: CocinaHomeComponent },
  { path: 'pedidos', component: CocinaComponent }
];
