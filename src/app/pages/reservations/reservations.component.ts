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

@Component({
  selector: 'app-reservations',
  imports: [
    CommonModule,
    DatePipe,
    CommomButtonComponent,
    ModalComponent,
    FormReservationComponent,
    RouterLink,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
})
export class ReservationsComponent implements OnInit {
  reservations: Array<TReservations> = [];
  reservationInfo!: TReservations;
  guests!: Array<TGuests>;
  reservationId: string = '';
  viewOrNo: boolean = false;

  constructor(
    private reservationService: ReservationsService,
    private guestService: GuestsService,
    private roomService: RoomsService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.getGuests();
    this.roomService.getReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
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
