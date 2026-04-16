import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { CreateUsuarioDto, Usuario } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly loginForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]]
  });

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload = this.loginForm.getRawValue();
    this.loading.set(true);

    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        const existingUser = usuarios.find(
          (usuario) => usuario.email.toLowerCase() === payload.email.toLowerCase()
        );

        if (existingUser) {
          this.finishLogin(existingUser, 'Sesion iniciada correctamente');
          return;
        }

        const newUserPayload: CreateUsuarioDto = payload;
        this.usuarioService.createUsuario(newUserPayload).subscribe({
          next: (createdUser) => this.finishLogin(createdUser, 'Usuario creado e ingreso realizado'),
          error: () => {
            this.loading.set(false);
            this.snackBar.open('No fue posible crear el usuario.', 'Cerrar', { duration: 3000 });
          }
        });
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('No se pudo conectar con el backend.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  private finishLogin(user: Usuario, message: string): void {
    this.authService.login(user);
    this.loading.set(false);
    this.snackBar.open(message, 'Cerrar', { duration: 2500 });
    this.router.navigate(['/catalogo']);
  }
}
