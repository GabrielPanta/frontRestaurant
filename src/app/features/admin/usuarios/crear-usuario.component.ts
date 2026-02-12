import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';    
import { Usuario } from '../../../core/models/usuario.model';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './crear-usuario.component.html',
    styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent {

  roles: Usuario['rol'][] = ['ADMIN', 'MOZO', 'COCINA', 'CAJERO'];

  usuario: Usuario = {
    nombre: '',
    email: '',
    password: '',
    rol: 'MOZO'
  };

  constructor(private usuarioService: UsuarioService) {}

  crearUsuario() {

    if (!this.usuario.nombre ||
        !this.usuario.email ||
        !this.usuario.password ||
        !this.usuario.rol) {
      alert('Completa todos los campos');
      return;
    }

    console.log('Enviando:', this.usuario);

    this.usuarioService.crearUsuario(this.usuario)
      .subscribe({
        next: () => {
          alert('Usuario creado correctamente');

          this.usuario = {
            nombre: '',
            email: '',
            password: '',
            rol: 'MOZO'
          };
        },
        error: err => {
          alert(err.error?.message || 'Error al crear usuario');
        }
      });
  }

}

