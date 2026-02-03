import { Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `<h2>Panel Cocina</h2>`
})
class CocinaHomeComponent {}

export const COCINA_ROUTES: Routes = [
  { path: '', component: CocinaHomeComponent }
];
