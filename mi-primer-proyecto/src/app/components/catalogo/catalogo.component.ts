import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { Libro } from '../../interfaces/libro.interface';
import { CategoriaService } from '../../services/categoria.service';
import { LibroService } from '../../services/libro.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-catalogo',
  standalone: false,
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogoComponent implements OnInit {
  private readonly libroService = inject(LibroService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly reservaService = inject(ReservaService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly reservandoLibroId = signal<number | null>(null);
  readonly showOnlyAvailable = signal(false);
  readonly libros = signal<Libro[]>([]);
  readonly categorias = signal<Categoria[]>([]);

  readonly librosConCategoria = computed(() =>
    this.libros().map((libro) => ({
      ...libro,
      categoriaNombre:
        this.categorias().find((categoria) => categoria.id === libro.categoriaId)?.nombre ??
        'Sin categoria'
    }))
  );
  readonly totalLibros = computed(() => this.libros().length);
  readonly totalDisponibles = computed(() =>
    this.libros().reduce((total, libro) => total + libro.ejemplaresDisponibles, 0)
  );
  readonly categoriasActivas = computed(
    () => new Set(this.libros().map((libro) => libro.categoriaId).filter(Boolean)).size
  );

  ngOnInit(): void {
    this.loadCategorias();
    this.loadLibros();
  }

  onToggleDisponibles(checked: boolean): void {
    this.showOnlyAvailable.set(checked);
    this.loadLibros();
  }

  reservar(libro: Libro): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser || libro.ejemplaresDisponibles <= 0) {
      return;
    }

    this.reservandoLibroId.set(libro.id);
    const fechaDevolucion = new Date();
    fechaDevolucion.setDate(fechaDevolucion.getDate() + 7);

    this.reservaService
      .createReserva({
        usuarioId: currentUser.id,
        libroId: libro.id,
        fechaDevolucionEsperada: fechaDevolucion.toISOString()
      })
      .subscribe({
        next: () => {
          this.reservandoLibroId.set(null);
          this.snackBar.open('Reserva creada correctamente.', 'Cerrar', { duration: 2500 });
          this.updateLibroDisponibilidad(libro.id, -1);
        },
        error: (error) => {
          this.reservandoLibroId.set(null);
          this.snackBar.open(error.error?.message ?? 'No se pudo reservar el libro.', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  getPortadaUrl(libro: Libro): string {
    if (libro.portadaUrl) {
      return libro.portadaUrl;
    }

    const isbn = libro.isbn.replace(/[^0-9X]/gi, '');
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  }

  onPortadaError(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.hidden = true;
  }

  private loadLibros(): void {
    this.loading.set(true);
    const source$ = this.showOnlyAvailable()
      ? this.libroService.getLibrosDisponibles()
      : this.libroService.getLibros();

    source$.subscribe({
      next: (libros) => {
        this.libros.set(libros);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('No se pudieron cargar los libros.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private loadCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => {
        this.snackBar.open('No se pudieron cargar las categorias.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private updateLibroDisponibilidad(libroId: number, amount: number): void {
    this.libros.set(
      this.libros()
        .map((libro) =>
          libro.id === libroId
            ? { ...libro, ejemplaresDisponibles: libro.ejemplaresDisponibles + amount }
            : libro
        )
        .filter((libro) => !this.showOnlyAvailable() || libro.ejemplaresDisponibles > 0)
    );
  }
}
