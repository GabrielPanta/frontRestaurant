import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItemService } from '../../../core/services/menu-item.service';
import { MenuItem } from '../../../core/models/menu-item.model';

@Component({
  standalone: true,
  selector: 'app-menu-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  items: MenuItem[] = [];
  editando: MenuItem | null = null;

  form = this.fb.group({
    nombre: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    disponible: [true]
  });

  constructor(private fb: FormBuilder, private service: MenuItemService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe(data => this.items = data);
  }

  guardar() {
    if (this.form.invalid) return;

    const data = this.form.value as MenuItem;

    if (this.editando) {
      data.id = this.editando.id;
      this.service.actualizar(data).subscribe(() => {
        this.cancelar();
        this.cargar();
      });
    } else {
      this.service.crear(data).subscribe(() => {
        this.form.reset({ disponible: true, precio: 0 });
        this.cargar();
      });
    }
  }

  editar(item: MenuItem) {
    this.editando = item;
    this.form.patchValue(item);
  }

  eliminar(id?: number) {
    if (!id) return;
    this.service.eliminar(id).subscribe(() => this.cargar());
  }

  cancelar() {
    this.editando = null;
    this.form.reset({ disponible: true, precio: 0 });
  }
}

