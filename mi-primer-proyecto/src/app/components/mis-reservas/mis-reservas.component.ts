import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { Libro } from '../../interfaces/libro.interface';
import { Reserva } from '../../interfaces/reserva.interface';
import { LibroService } from '../../services/libro.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: false,
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MisReservasComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly reservaService = inject(ReservaService);
  private readonly libroService = inject(LibroService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly actionReservaId = signal<number | null>(null);
  readonly reservas = signal<Reserva[]>([]);
  readonly libros = signal<Libro[]>([]);

  readonly reservasDetalladas = computed(() =>
    this.reservas().map((reserva) => ({
      ...reserva,
      libroTitulo:
        this.libros().find((libro) => libro.id === reserva.libroId)?.titulo ?? 'Libro no encontrado'
    }))
  );

  ngOnInit(): void {
    this.loadLibros();
    this.loadReservas();
  }

  cancelarReserva(reservaId: number): void {
    this.executeReservaAction(reservaId, 'cancelar');
  }

  devolverReserva(reservaId: number): void {
    this.executeReservaAction(reservaId, 'devolver');
  }

  private loadReservas(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.reservaService.getReservasByUsuario(currentUser.id).subscribe({
      next: (reservas) => {
        this.reservas.set(reservas);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('No se pudieron cargar las reservas.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private loadLibros(): void {
    this.libroService.getLibros().subscribe({
      next: (libros) => this.libros.set(libros),
      error: () => {
        this.snackBar.open('No se pudieron cargar los libros del catalogo.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  private executeReservaAction(reservaId: number, action: 'cancelar' | 'devolver'): void {
    this.actionReservaId.set(reservaId);

    const request$ =
      action === 'cancelar'
        ? this.reservaService.cancelarReserva(reservaId)
        : this.reservaService.devolverReserva(reservaId);

    request$.subscribe({
      next: (updatedReserva) => {
        this.actionReservaId.set(null);
        this.reservas.set(
          this.reservas().map((reserva) => (reserva.id === reservaId ? updatedReserva : reserva))
        );
        this.snackBar.open(
          action === 'cancelar' ? 'Reserva cancelada.' : 'Libro devuelto correctamente.',
          'Cerrar',
          { duration: 2500 }
        );
      },
      error: (error) => {
        this.actionReservaId.set(null);
        this.snackBar.open(error.error?.message ?? 'No se pudo completar la accion.', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }
}
