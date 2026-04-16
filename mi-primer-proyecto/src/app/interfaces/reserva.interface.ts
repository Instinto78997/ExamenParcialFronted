export interface Reserva {
  id: number;
  usuarioId: number;
  libroId: number;
  fechaReserva: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal: string | null;
  estado: 'activa' | 'cancelada' | 'devuelta';
}

export interface CreateReservaDto {
  usuarioId: number;
  libroId: number;
  fechaDevolucionEsperada: string;
}
