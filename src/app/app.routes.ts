import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'admin', data: { roles: ['ADMIN'] }, loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
      { path: 'mozo', data: { roles: ['MOZO'] }, loadChildren: () => import('./features/mozo/mozo.routes').then(m => m.MOZO_ROUTES) },
      { path: 'cocina', data: { roles: ['COCINA'] }, loadChildren: () => import('./features/cocina/cocina.routes').then(m => m.COCINA_ROUTES) },
      { path: 'cajero', data: { roles: ['CAJERO'] }, loadChildren: () => import('./features/cajero/cajero.routes').then(m => m.CAJERO_ROUTES) }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];


