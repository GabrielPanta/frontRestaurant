export interface Mesa {
  id: number;
  numero: number;
  estado: 'LIBRE' | 'OCUPADA' | 'RESERVADA';
}
