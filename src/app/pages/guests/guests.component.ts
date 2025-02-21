import { Component, OnInit } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { TGuests } from '../../@types/guests';
import { ModalComponent } from '../../components/modal/modal.component';
import { FormGuestComponent } from '../../components/form-guest/form-guest.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { CommomButtonComponent } from '../../components/commom-button/commom-button.component';
import { ReservationsService } from '../../services/reservations.service';
import { TReservations } from '../../@types/reservations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guests',
  imports: [
    ModalComponent,
    FormGuestComponent,
    AlertComponent,
    CommomButtonComponent,
    CommonModule,
  ],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.scss',
})
export class GuestsComponent implements OnInit {
  guests: Array<TGuests> = [];
  reservation!: TReservations;
  reservations: Array<TReservations> = [];
  guestHasReservation: boolean = false;
  guestId: string = '';
  guestIdHasReservation: string = '';
  viewOrNo: boolean = false;

  constructor(
    private guestService: GuestsService,
    private reservationService: ReservationsService
  ) {}

  ngOnInit(): void {
    this.loadFirstGuest();
    this.loadGuests();
    this.getReservations();
  }

  loadFirstGuest(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        if (guests.length > 0) {
          this.guestId = guests[0].id;
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadGuests(): void {
    this.guestService.getGuests().subscribe({
      next: (guests) => {
        this.guests = guests;
        // if (guests.length > 0) {
        //   this.loadGuestInformations(guests[0].id);
        // }
      },
      error: (err) => console.error(err),
    });
  }

  loadGuestInformations(id: string): void {
    this.guestService.getGuestById(id).subscribe({
      next: (guest) => {
        this.guestId = guest.id;
      },
      error: (err) => console.error(err),
    });
  }

  getReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (reserv) => {
        this.reservations = reserv;
        console.log('EIS AQUI AS RESERVA:', this.reservations);
      },
    });
  }

  validationGustHasReservation(id: string): boolean {
    this.reservations.forEach((element) => {
      if (element.guestId == id) {
        this.guestIdHasReservation = element.guestId;
        console.log('GUEST POSSUI SIM RESERVA', element.guestId);
      }
    });
    this.guestIdHasReservation == id
      ? (this.guestHasReservation = true)
      : (this.guestHasReservation = false);
    return true;
  }

  removeGuest(id: string): void {
    if (this.guestIdHasReservation != id) {
      this.guestHasReservation = false;
      this.guestService.deleteGuest(id).subscribe({
        next: (value) => {
          console.log('GUEST EXCLUIDO!', value);
          this.loadGuests();
        },
        error: (err) => console.error(err),
      });
    }
  }

  openModal(id: string, modalId: string) {
    if (modalId == 'modalDeleteGuest') {
      this.validationGustHasReservation(id);
    }
    this.guestId = id;
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
      this.loadGuests();
      this.toggleModal('modalUpdate', false);
      this.toggleModal('modalInsert', false);
      this.toggleModal('modalDeleteGuest', false);
    }, 100);
    setTimeout(() => {
      clearInterval(intervalId);
      this.viewOrNo = false;
    }, 2500);
  }
}
