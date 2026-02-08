import { Mesa } from './mesa.model';

export interface Pedido {
  id: number;
  estado: string;
  fecha: string;
  total: number;
  mesa: Mesa;
}

