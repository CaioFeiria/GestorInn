import { Injectable } from '@angular/core';
import { ReservationsService } from './reservations.service';
import { TReservations } from '../@types/reservations';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  reservations!: Array<TReservations>;

  standardRoomQuantity: number = 10;
  deluxeRoomQuantity: number = 5;
  suiteRoomQuantity: number = 3;

  standartCapacityRoom: number = 2;
  deluxeCapacityRoom: number = 4;
  suiteCapacityRoom: number = 6;

  constructor(private reservationService: ReservationsService) {}

  getReservations(): void {
    console.log('FUNÇÃO DE PESQUISAR QUARTOS DISPONIVEIS');
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        const interval = setInterval(() => {
          console.log('PESQUISANDOOOO');
          this.searchForAvailableRooms();
        }, 5000);
        setTimeout(() => {
          clearInterval(interval);
        }, 5000);
      },
    });
  }

  searchForAvailableRooms(): void {
    console.log('FUNÇÃO SWITCHCASE QUARTOS DISPONIVEIS');
    this.reservations.forEach((re) => {
      console.log('TYPE ROOM', re.roomType);
      switch (re.roomType) {
        case 'Deluxe':
          if (this.deluxeRoomQuantity > 0) {
            this.deluxeRoomQuantity -= 1;
            console.log(this.deluxeRoomQuantity);
          } else {
            console.log('Não a mais vagas nos Quartos DELUXE');
          }
          break;
        case 'Standart':
          if (this.standardRoomQuantity > 0) {
            this.standardRoomQuantity -= 1;
            console.log(this.standardRoomQuantity);
          } else {
            console.log('Não a mais vagas nos STANDART');
          }
          break;
        case 'Suite':
          if (this.suiteRoomQuantity > 0) {
            this.suiteCapacityRoom -= 1;
            console.log(this.suiteRoomQuantity);
          } else {
            console.log('Não a mais vagas nos Quartos SUITE');
          }
          break;

        default:
          console.log('nenhuma das opções válidas');
          break;
      }
    });
  }
}
