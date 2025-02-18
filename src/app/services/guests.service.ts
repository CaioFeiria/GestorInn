import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TGuests } from '../@types/guests';

@Injectable({
  providedIn: 'root',
})
export class GuestsService {
  private apiUrl: string = 'http://localhost:3000/guests';

  constructor(private http: HttpClient) {}

  getGuests(): Observable<Array<TGuests>> {
    return this.http.get<Array<TGuests>>(this.apiUrl);
  }

  getGuestById(id: number): Observable<TGuests> {
    return this.http.get<TGuests>(`${this.apiUrl}/${id}`);
  }

  insertGuest(guest?: TGuests): Observable<TGuests> {
    return this.http.post<TGuests>(this.apiUrl, { ...guest });
  }

  updateGuest(id: number, guest: TGuests): Observable<TGuests> {
    return this.http.put<TGuests>(`${this.apiUrl}/${id}`, { ...guest });
  }

  deleteGuest(id: string): Observable<TGuests> {
    return this.http.delete<TGuests>(`${this.apiUrl}/${id}`);
  }
}
