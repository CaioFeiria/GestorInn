import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TReservations } from '../@types/reservations';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  private apiUrl: string = 'http://localhost:3000/reservations';

  constructor(private http: HttpClient) {}

  getReservations(): Observable<Array<TReservations>> {
    return this.http.get<Array<TReservations>>(this.apiUrl);
  }

  getReservationById(id: string): Observable<TReservations> {
    return this.http.get<TReservations>(`${this.apiUrl}/${id}`);
  }

  insertReservation(reservation: TReservations): Observable<TReservations> {
    return this.http.post<TReservations>(this.apiUrl, { ...reservation });
  }

  updateReservation(
    id: string,
    reservation: TReservations
  ): Observable<TReservations> {
    return this.http.put<TReservations>(`${this.apiUrl}/${id}`, {
      ...reservation,
    });
  }

  deleteReservation(id: string): Observable<TReservations> {
    return this.http.delete<TReservations>(`${this.apiUrl}/${id}`);
  }
}
