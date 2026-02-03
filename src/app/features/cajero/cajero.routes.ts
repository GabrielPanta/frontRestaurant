import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<h2>Panel Cajero</h2>`
})
class CajeroHomeComponent {}

export const CAJERO_ROUTES: Routes = [
  { path: '', component: CajeroHomeComponent }
];
