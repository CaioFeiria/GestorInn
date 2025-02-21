import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReservationsService } from '../../services/reservations.service';
import { TReservations } from '../../@types/reservations';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { FormReservationComponent } from '../../components/form-reservation/form-reservation.component';
import { RoomsService } from '../../services/rooms.service';
import { RouterLink } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-reservations',
  imports: [
    CommonModule,
    DatePipe,
    CommomButtonComponent,
    ModalComponent,
    FormReservationComponent,
    RouterLink,
    SearchComponent,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
  reservations: Array<TReservations> = [];
  reservationsBackup: Array<TReservations> = [];
  reservationInfo!: TReservations;
  guests!: Array<TGuests>;
  reservationId: string = '';
  viewOrNo: boolean = false;
  optionSearch: string = '';

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService,
    private roomService: RoomsService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadOptionSearch();
    this.loadReservations();
    this.getGuests();
    this.roomService.getReservations();
    this.inputSearch();
  }

  loadOptionSearch(): void {
    this.searchService.searchedOption$.subscribe({
      next: (value) => {
        this.optionSearch = value;
      },
    });
  }

  inputSearch(): void {
    this.searchService.searched$.subscribe({
      next: (value) => {
        this.filter(value);
      },
    });
  }

  filter(search: string): void {
    switch (this.optionSearch) {
      case 'checkIn':
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.checkIn.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
      case 'checkOut':
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.checkOut.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
      case 'status':
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.status.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
      default:
        this.reservations = search.trim()
          ? this.reservations.filter((res) =>
              res.roomType.toLowerCase().includes(search.toLowerCase())
            )
          : [...this.reservationsBackup];
        break;
    }
  }

  orderBy(arr: number[]): number[] {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.reservationsBackup = reservations;
      },
      error: (err) => console.error(err),
    });
  }

  getInformationsReservation(id: string): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservationInfo = reservation;
      },
      error: (err) => console.error(err),
    });
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guest) => {
        this.guests = guest;
      },
      error: (err) => console.error(err),
    });
  }

  removeReservation(id: string): void {
    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.loadReservations();
      },
      error: (err) => console.error(err),
    });
  }

  openModal(id: string, modalId: string) {
    this.reservationId = id;
    this.toggleModal(modalId, true);
  }

  toggleModal(modalId: string, isOpen: boolean): void {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      isOpen ? modal.showModal() : modal.close();
    }
  }

  orderByCheckIn(): void {
    for (let i = 0; i < this.reservations.length; i++) {
      for (let j = i + 1; j < this.reservations.length; j++) {
        if (
          new Date(this.reservations[i].checkIn) >
          new Date(this.reservations[j].checkIn)
        ) {
          let temp = this.reservations[i];
          this.reservations[i] = this.reservations[j];
          this.reservations[j] = temp;
        }
      }
    }
  }

  orderByCheckOut(): void {
    for (let i = 0; i < this.reservations.length; i++) {
      for (let j = i + 1; j < this.reservations.length; j++) {
        if (
          new Date(this.reservations[i].checkOut) >
          new Date(this.reservations[j].checkOut)
        ) {
          let temp = this.reservations[i];
          this.reservations[i] = this.reservations[j];
          this.reservations[j] = temp;
        }
      }
    }
  }

  // orderByCheckOut(): void {
  //   for (let i = 1; i < this.reservations.length; i++) {
  //     const currentElement = new Date(this.reservations[i].checkOut);
  //     let j = i - 1;
  //     while (
  //       j >= 0 &&
  //       new Date(this.reservations[j].checkOut) > currentElement
  //     ) {
  //       this.reservations[j + 1].checkOut = this.reservations[j].checkOut;
  //       j--;
  //     }
  //     this.reservations[j + 1].checkOut = currentElement.toString();
  //   }
  // }

  orderByStatus(): void {
    for (let i = 0; i < this.reservations.length; i++) {
      for (let j = i + 1; j < this.reservations.length; j++) {
        if (this.reservations[i].status > this.reservations[j].status) {
          let temp = this.reservations[i];
          this.reservations[i] = this.reservations[j];
          this.reservations[j] = temp;
        }
      }
    }
  }

  viewAlert(value: boolean): void {
    const intervalId = setInterval(() => {
      this.viewOrNo = value;
      this.loadReservations();
      this.toggleModal('modalUpdate', false);
      this.toggleModal('modalInsert', false);
      this.toggleModal('modalDeleteReservation', false);
    }, 100);
    setTimeout(() => {
      clearInterval(intervalId);
      this.viewOrNo = false;
    }, 2500);
  }
}
