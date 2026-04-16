import { Injectable, computed, signal } from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';

const STORAGE_KEY = 'biblioteca-current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<Usuario | null>(this.readStoredUser());

  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  currentUser(): Usuario | null {
    return this.currentUserSignal();
  }

  login(user: Usuario): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUserSignal.set(null);
  }

  private readStoredUser(): Usuario | null {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as Usuario;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
