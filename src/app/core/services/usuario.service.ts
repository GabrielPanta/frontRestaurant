import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API = 'http://localhost:8080/auth';
  private API2 = 'http://localhost:8080/usuarios/all';

  constructor(private http: HttpClient) {}

  crearUsuario(usuario: Usuario) {
    return this.http.post(`${this.API}/register`, usuario);
  }

  listarUsuarios() {
    return this.http.get<Usuario[]>(this.API2);
  }

}

