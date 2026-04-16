import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from './api.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CreateReservaDto, Reserva } from '../interfaces/reserva.interface';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/reservas`;

  getReservasByUsuario(usuarioId: number): Observable<Reserva[]> {
    return this.http
      .get<ApiResponse<Reserva[]>>(`${this.baseUrl}/usuario/${usuarioId}`)
      .pipe(map((response) => response.data));
  }

  createReserva(payload: CreateReservaDto): Observable<Reserva> {
    return this.http
      .post<ApiResponse<Reserva>>(this.baseUrl, payload)
      .pipe(map((response) => response.data));
  }

  cancelarReserva(reservaId: number): Observable<Reserva> {
    return this.http
      .put<ApiResponse<Reserva>>(`${this.baseUrl}/${reservaId}/cancelar`, {})
      .pipe(map((response) => response.data));
  }

  devolverReserva(reservaId: number): Observable<Reserva> {
    return this.http
      .put<ApiResponse<Reserva>>(`${this.baseUrl}/${reservaId}/devolver`, {})
      .pipe(map((response) => response.data));
  }
}
