import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './listar-usuarios.component.html',
    styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit {

    usuarios: Usuario[] = [];

    constructor(private usuarioService: UsuarioService) {}

    ngOnInit() {
        this.usuarioService.listarUsuarios().subscribe({
            next: data => {
                this.usuarios = data;
            },
            error: err => {
                alert(err.error?.message || 'Error al cargar usuarios');
            }
        });
    }

}
