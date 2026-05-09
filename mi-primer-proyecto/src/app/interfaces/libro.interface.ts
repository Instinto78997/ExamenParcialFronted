export interface Libro {
  id: number;
  titulo: string;
  isbn: string;
  anoPublicacion: number;
  editorial: string;
  portadaUrl?: string | null;
  ejemplaresTotal: number;
  ejemplaresDisponibles: number;
  categoriaId: number | null;
}
