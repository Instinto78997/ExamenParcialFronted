import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from './api.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Libro } from '../interfaces/libro.interface';

@Injectable({ providedIn: 'root' })
export class LibroService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/libros`;

  getLibros(): Observable<Libro[]> {
    return this.http
      .get<ApiResponse<Libro[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  getLibrosDisponibles(): Observable<Libro[]> {
    return this.http
      .get<ApiResponse<Libro[]>>(`${this.baseUrl}/disponibles`)
      .pipe(map((response) => response.data));
  }
}
