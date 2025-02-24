import { Injectable } from '@angular/core';
import { ReservationsService } from './reservations.service';
import { TReservations } from '../@types/reservations';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { TRooms } from '../@types/rooms';

@Injectable({
  providedIn: 'root',
})

// Rooms service
// Objeto room com os quartos tendo sua capacidade, quartos reservados e quantidade de quartos disponíveis no hotel
// Método getAvailableRooms retorna o número de quartos disponíveis, fazendo a subtração da quantidade com os já reservados
// Método isRoomAvailable booleano que retorna se há quarto disponível daquele tipo ou não
// Método checkRoomCapacity verifica a capacidade de hóspedes de um determinado tipo de quarto
// Método getReservations busca todas as resevas do db.json e já faz o update do obj rooms contando quantos quartos já estão reservados e ainda não foram
// Método updateAvailableRooms com o array de reservas ele faz um foreach percorrando todas as reservas, e para cada tipo de quarto ele soma uma reserva e da um next na alteração do obj notificando todos os inscritos
// Método resetReservations transforma o obj rooms em um vetor e para cada obj ele acessa o atributo reserved e reseta para 0
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

  reservations: Array<TReservations> = [];

  private roomsSubject = new BehaviorSubject<TRooms>(this.rooms);
  rooms$ = this.roomsSubject.asObservable();

  constructor(private reservationService: ReservationsService) {}

  // Retorna o número de quartos disponíveis para um tipo específico
  getAvailableRooms(roomType: string): number {
    if (!this.rooms[roomType]) return 0;
    return this.rooms[roomType].quantity - this.rooms[roomType].reserved;
  }

  // Verifica se há quartos disponíveis para um tipo específico
  isRoomAvailable(roomType: string): boolean {
    return this.getAvailableRooms(roomType) > 0;
  }

  // Verifica se um quarto do tipo roomType pode acomodar um número específico de hóspedes
  checkRoomCapacity(roomType: string, capacity: number): boolean {
    if (!this.rooms[roomType]) return false;
    if (this.rooms[roomType].capacity + 1 <= capacity) {
      return true;
    }
    return false;
  }

  // Busca a lista de reservas e atualiza a disponibilidade dos quartos
  async getReservations(): Promise<void> {
    this.reservationService.getReservations().subscribe({
      next: async (reservations) => {
        this.reservations = reservations;
        await this.updateAvailableRooms(this.reservations);
      },
      error: (err) => console.error(err),
    });
  }

  // Atualiza o número de quartos reservados com base na lista de reservas
  private async updateAvailableRooms(
    reservations: TReservations[]
  ): Promise<void> {
    this.resetReservations();

    reservations.forEach((reservation) => {
      const { roomType } = reservation;

      if (this.rooms[roomType]) {
        this.rooms[roomType].reserved++;
      }
    });

    this.roomsSubject.next({ ...this.rooms });
  }

  // Zera o contador de reservas para todos os tipos de quarto
  // Object.keys transforma o obj em um array mas acessamos somente o index e não o valor
  private resetReservations(): void {
    Object.keys(this.rooms).forEach((roomType) => {
      this.rooms[roomType].reserved = 0;
    });
  }
}
