export type EstadoMesa = 'LIBRE' | 'OCUPADA' | 'RESERVADA';

export interface Mesa {
  id: number;
  numero: number;
  estado: EstadoMesa;
}

