export interface Libro {
  id: number;
  titulo: string;
  isbn: string;
  anoPublicacion: number;
  editorial: string;
  ejemplaresTotal: number;
  ejemplaresDisponibles: number;
  categoriaId: number | null;
}
