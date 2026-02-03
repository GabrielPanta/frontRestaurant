import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
class AdminHomeComponent {}

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminHomeComponent }
];
