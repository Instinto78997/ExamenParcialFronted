import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from './api.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/categorias`;

  getCategorias(): Observable<Categoria[]> {
    return this.http
      .get<ApiResponse<Categoria[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }
}
