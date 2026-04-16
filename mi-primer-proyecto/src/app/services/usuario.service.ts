import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from './api.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CreateUsuarioDto, Usuario } from '../interfaces/usuario.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/usuarios`;

  getUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<ApiResponse<Usuario[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  createUsuario(payload: CreateUsuarioDto): Observable<Usuario> {
    return this.http
      .post<ApiResponse<Usuario>>(this.baseUrl, payload)
      .pipe(map((response) => response.data));
  }
}
