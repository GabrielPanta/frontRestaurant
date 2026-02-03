import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<h2>Panel Mozo</h2>`
})
class MozoHomeComponent {}

export const MOZO_ROUTES: Routes = [
  { path: '', component: MozoHomeComponent }
];
