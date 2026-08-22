export interface ProductoMasVendido {
  nombre: string;
  cantidad: number;
}

export interface PuntoSerieTemporal {
  fecha: string;
  total: number;
  pedidos: number;
}

export interface VentaDiaria {
  totalVentas: number;
  ticketPromedio: number;
  cantidadPedidos: number;
  fecha?: string;
  fechaInicio?: string;
  fechaFin?: string;
  serieTemporal?: PuntoSerieTemporal[];
}