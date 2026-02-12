export interface Usuario {
  nombre: string;
  email: string;
  password: string;
  rol: 'ADMIN' | 'MOZO' | 'COCINA' | 'CAJERO';
}
