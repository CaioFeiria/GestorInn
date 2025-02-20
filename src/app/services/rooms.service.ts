import { Injectable } from '@angular/core';
import { ReservationsService } from './reservations.service';
import { TReservations } from '../@types/reservations';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { TRooms } from '../@types/rooms';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  private rooms: TRooms = {
    Standard: {
      type: 'Standard',
      quantity: 10,
      capacity: 2,
      reserved: 0,
    },
    Deluxe: {
      type: 'Deluxe',
      quantity: 5,
      capacity: 4,
      reserved: 0,
    },
    Suite: {
      type: 'Suite',
      quantity: 3,
      capacity: 6,
      reserved: 0,
    },
  };

  private roomsSubject = new BehaviorSubject<TRooms>(this.rooms);
  rooms$ = this.roomsSubject.asObservable();

  constructor(private reservationService: ReservationsService) {}

  // Retorna a quantidade disponível de um tipo específico de quarto
  getAvailableRooms(roomType: string): number {
    if (!this.rooms[roomType]) return 0;
    return this.rooms[roomType].quantity - this.rooms[roomType].reserved;
  }

  // Verifica se um quarto específico está disponível
  isRoomAvailable(roomType: string): boolean {
    return this.getAvailableRooms(roomType) > 0;
  }

  checkRoomCapacity(roomType: string, capacity: number): boolean {
    if (!this.rooms[roomType]) return false;
    if (this.rooms[roomType].capacity + 1 <= capacity) {
      return true;
    }
    return false;
  }

  // Busca todas as reservas e atualiza o estado dos quartos
  async getReservations(): Promise<void> {
    try {
      const reservations = await firstValueFrom(
        this.reservationService.getReservations()
      );
      await this.updateAvailableRooms(reservations);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
    }
  }

  // Atualiza a disponibilidade dos quartos baseado nas reservas
  private async updateAvailableRooms(
    reservations: TReservations[]
  ): Promise<void> {
    // Reseta as reservas antes de atualizar
    this.resetReservations();

    // Conta as reservas para cada tipo de quarto
    reservations.forEach((reservation) => {
      const { roomType } = reservation;

      if (this.rooms[roomType]) {
        this.rooms[roomType].reserved++;
      }
    });

    this.roomsSubject.next({ ...this.rooms });
  }
  private resetReservations(): void {
    Object.keys(this.rooms).forEach((roomType) => {
      this.rooms[roomType].reserved = 0;
    });
  }
}
